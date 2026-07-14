package com.foodsystem.orderservice.controller;

import com.foodsystem.orderservice.dto.DeliveryMessage;
import com.foodsystem.orderservice.dto.OrderRequest;
import com.foodsystem.orderservice.dto.OrderResponse;
import com.foodsystem.orderservice.entity.OrderEntity;
import com.foodsystem.orderservice.entity.OrderItemEntity;
import com.foodsystem.orderservice.repository.OrderRepository;
import com.foodsystem.orderservice.repository.OrderItemRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.camunda.bpm.engine.RuntimeService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.jms.core.JmsTemplate;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "*")
public class OrderController {

    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final RuntimeService runtimeService;
    private final JmsTemplate jmsTemplate;

    @PostMapping
    public ResponseEntity<OrderResponse> placeOrder(@RequestBody OrderRequest request) {
        String orderId = UUID.randomUUID().toString();
        log.info("[OrderService] Order #{} - Placing new order for customer: {}", orderId, request.getCustomerId());

        OrderEntity order = new OrderEntity();
        order.setId(orderId);
        order.setCustomerId(request.getCustomerId());
        order.setAddress(request.getAddress());
        order.setStatus("PLACED");
        order.setPaymentStatus("PENDING");
        order.setCreatedAt(LocalDateTime.now());

        // Process and save structured items if present
        if (request.getItemDetails() != null && !request.getItemDetails().isEmpty()) {
            StringBuilder sb = new StringBuilder();
            double total = 0;
            for (int i = 0; i < request.getItemDetails().size(); i++) {
                OrderRequest.OrderItemDto item = request.getItemDetails().get(i);
                if (i > 0) sb.append(", ");
                sb.append(item.getQuantity()).append("x ").append(item.getName());
                total += item.getPrice() * item.getQuantity();

                OrderItemEntity itemEntity = new OrderItemEntity();
                itemEntity.setOrderItemId(UUID.randomUUID().toString());
                itemEntity.setOrderId(orderId);
                itemEntity.setFoodId(item.getFoodId());
                itemEntity.setName(item.getName());
                itemEntity.setQuantity(item.getQuantity());
                itemEntity.setPrice(item.getPrice());
                orderItemRepository.save(itemEntity);
            }
            order.setItems(sb.toString());
            order.setAmount(total);
        } else {
            order.setItems(request.getItems() != null ? request.getItems() : "");
            order.setAmount(request.getAmount());
        }

        orderRepository.save(order);
        log.info("[OrderService] Order #{} - Saved as PLACED, Payment status PENDING", orderId);

        return ResponseEntity.status(HttpStatus.CREATED).body(mapToResponse(order));
    }

    @PostMapping("/{id}/pay")
    public ResponseEntity<?> payOrder(@PathVariable String id,
                                      @RequestParam(defaultValue = "CARD") String paymentMethod) {
        log.info("[OrderService] Order #{} - Processing online payment request via {}", id, paymentMethod);
        
        OrderEntity order = orderRepository.findById(id).orElse(null);
        if (order == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Order not found");
        }

        if (!"PLACED".equals(order.getStatus())) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Payment can only be made for orders in PLACED status");
        }

        order.setPaymentMethod(paymentMethod.toUpperCase());
        order.setPaymentStatus("PAID");
        order.setStatus("PAYMENT_COMPLETED");
        orderRepository.save(order);

        // Start the Camunda Saga process
        try {
            runtimeService.startProcessInstanceByKey("food-ordering-process", id);
            log.info("[OrderService] Order #{} - Camunda process started on {} payment", id, paymentMethod);
        } catch (Exception e) {
            log.error("[OrderService] Order #{} - Failed to start Camunda process: ", id, e);
            order.setStatus("FAILED");
            orderRepository.save(order);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to start workflow: " + e.getMessage());
        }

        return ResponseEntity.ok(mapToResponse(order));
    }

    @PostMapping("/{id}/cod")
    public ResponseEntity<?> codOrder(@PathVariable String id) {
        log.info("[OrderService] Order #{} - Processing Cash on Delivery request", id);

        OrderEntity order = orderRepository.findById(id).orElse(null);
        if (order == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Order not found");
        }

        if (!"PLACED".equals(order.getStatus())) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("COD can only be selected for orders in PLACED status");
        }

        order.setPaymentMethod("COD");
        order.setPaymentStatus("COD_PENDING");
        order.setStatus("PAYMENT_COMPLETED");
        orderRepository.save(order);
        log.info("[OrderService] Order #{} - COD order confirmed, payment pending until delivery", id);

        // Start the Camunda Saga process (food preparation starts even though payment is pending)
        try {
            runtimeService.startProcessInstanceByKey("food-ordering-process", id);
            log.info("[OrderService] Order #{} - Camunda process started for COD order", id);
        } catch (Exception e) {
            log.error("[OrderService] Order #{} - Failed to start Camunda process: ", id, e);
            order.setStatus("FAILED");
            orderRepository.save(order);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to start workflow: " + e.getMessage());
        }

        return ResponseEntity.ok(mapToResponse(order));
    }

    @PostMapping("/{id}/confirm-cod-payment")
    public ResponseEntity<?> confirmCodPayment(@PathVariable String id) {
        log.info("[OrderService] Order #{} - Delivery partner confirming COD cash collection", id);

        OrderEntity order = orderRepository.findById(id).orElse(null);
        if (order == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Order not found");
        }

        if (!"COD".equals(order.getPaymentMethod())) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("This order is not a Cash on Delivery order");
        }

        if (!"COD_PENDING".equals(order.getPaymentStatus())) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("COD payment has already been confirmed for this order");
        }

        order.setPaymentStatus("PAID");
        orderRepository.save(order);
        log.info("[OrderService] Order #{} - COD payment confirmed by delivery partner. Amount: {}", id, order.getAmount());

        return ResponseEntity.ok(mapToResponse(order));
    }

    @PostMapping("/{id}/accept")
    public ResponseEntity<?> acceptOrder(@PathVariable String id) {
        log.info("[OrderService] Order #{} - Accepting order by shop keeper", id);

        OrderEntity order = orderRepository.findById(id).orElse(null);
        if (order == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Order not found");
        }

        if (!"PAYMENT_COMPLETED".equals(order.getStatus())) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Order can only be accepted after PAYMENT_COMPLETED");
        }

        order.setStatus("PREPARING");
        orderRepository.save(order);
        log.info("[OrderService] Order #{} - Status updated to PREPARING", id);

        return ResponseEntity.ok(mapToResponse(order));
    }

    @PostMapping("/{id}/status")
    public ResponseEntity<?> updateKitchenStatus(@PathVariable String id, @RequestParam String status) {
        log.info("[OrderService] Order #{} - Shop Keeper requesting status update to: {}", id, status);

        OrderEntity order = orderRepository.findById(id).orElse(null);
        if (order == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Order not found");
        }

        String targetStatus = status.toUpperCase();
        if (!"PREPARING".equals(targetStatus) && !"READY_FOR_DELIVERY".equals(targetStatus) && !"OUT_FOR_DELIVERY".equals(targetStatus)) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid status update for Shop Keeper");
        }

        order.setStatus(targetStatus);
        orderRepository.save(order);
        log.info("[OrderService] Order #{} - Status successfully updated to {}", id, targetStatus);

        // If the Shop Keeper dispatches the order, advance Camunda to trigger delivery request
        if ("OUT_FOR_DELIVERY".equals(targetStatus)) {
            try {
                runtimeService.createMessageCorrelation("KitchenResponseMessage")
                        .processInstanceBusinessKey(id)
                        .setVariable("kitchenStatus", "ACCEPTED")
                        .correlate();
                log.info("[OrderService] Order #{} - Correlated KitchenResponseMessage to advance process to Delivery", id);
            } catch (Exception e) {
                log.error("[OrderService] Order #{} - Failed to correlate KitchenResponseMessage: ", id, e);
            }
        }

        return ResponseEntity.ok(mapToResponse(order));
    }

    @PostMapping("/{id}/deliver")
    public ResponseEntity<?> deliverOrder(@PathVariable String id) {
        log.info("[OrderService] Order #{} - Delivery Partner marking order as DELIVERED", id);

        OrderEntity order = orderRepository.findById(id).orElse(null);
        if (order == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Order not found");
        }

        if (!"OUT_FOR_DELIVERY".equals(order.getStatus())) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Order can only be marked DELIVERED if it is OUT_FOR_DELIVERY");
        }

        order.setStatus("DELIVERED");
        orderRepository.save(order);

        // Correlate DeliveryResponseMessage in Camunda to complete the workflow
        try {
            runtimeService.createMessageCorrelation("DeliveryResponseMessage")
                    .processInstanceBusinessKey(id)
                    .setVariable("deliveryStatus", "DELIVERED")
                    .correlate();
            log.info("[OrderService] Order #{} - Correlated DeliveryResponseMessage to complete process", id);
        } catch (Exception e) {
            log.error("[OrderService] Order #{} - Failed to correlate DeliveryResponseMessage: ", id, e);
        }

        // Send confirmation back to delivery-service request queue to update Delivery Service database
        try {
            DeliveryMessage confirmMessage = new DeliveryMessage();
            confirmMessage.setOrderId(id);
            confirmMessage.setStatus("DELIVERED");
            confirmMessage.setDeliveryId(order.getDeliveryId());
            confirmMessage.setMessage("Marked DELIVERED by driver");
            jmsTemplate.convertAndSend("delivery-request-queue", confirmMessage);
            log.info("[OrderService] Order #{} - Dispatched DELIVERED confirmation to delivery-request-queue", id);
        } catch (Exception e) {
            log.error("[OrderService] Order #{} - Failed to send DELIVERED confirmation to queue: ", id, e);
        }

        return ResponseEntity.ok(mapToResponse(order));
    }

    @PostMapping("/{id}/cancel")
    public ResponseEntity<?> cancelOrder(@PathVariable String id) {
        log.info("[OrderService] Order #{} - Customer requesting cancellation", id);

        OrderEntity order = orderRepository.findById(id).orElse(null);
        if (order == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Order not found");
        }

        String currentStatus = order.getStatus();

        // Only allow cancellation for PLACED (unpaid) or PAYMENT_COMPLETED (paid but not yet cooking)
        if (!"PLACED".equals(currentStatus) && !"PAYMENT_COMPLETED".equals(currentStatus)) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Order can only be cancelled before preparation starts. Current status: " + currentStatus);
        }

        boolean wasPaid = "PAID".equals(order.getPaymentStatus());
        boolean wasCodPending = "COD_PENDING".equals(order.getPaymentStatus());

        order.setStatus("CANCELLED");
        if (wasPaid) {
            order.setPaymentStatus("REFUND_INITIATED");
        } else if (wasCodPending) {
            order.setPaymentStatus("CANCELLED");
        }
        orderRepository.save(order);

        // If payment was already made (online), trigger refund via payment service
        if (wasPaid) {
            try {
                com.foodsystem.orderservice.dto.PaymentMessage refundMsg = new com.foodsystem.orderservice.dto.PaymentMessage();
                refundMsg.setOrderId(id);
                refundMsg.setAmount(order.getAmount());
                refundMsg.setStatus("REFUNDED");
                refundMsg.setMessage("Customer-initiated cancellation refund");
                jmsTemplate.convertAndSend("payment-request-queue", refundMsg);
                log.info("[OrderService] Order #{} - Refund request sent to payment-request-queue", id);
            } catch (Exception e) {
                log.error("[OrderService] Order #{} - Failed to send refund request: ", id, e);
            }
        }

        log.info("[OrderService] Order #{} - Order cancelled successfully (was paid: {})", id, wasPaid);
        return ResponseEntity.ok(mapToResponse(order));
    }

    @GetMapping
    public ResponseEntity<List<OrderResponse>> getAllOrders(
            @RequestParam(required = false) String customerId,
            @RequestParam(required = false) String status) {
        
        List<OrderEntity> orders = orderRepository.findAll();

        if (customerId != null) {
            orders = orders.stream()
                    .filter(o -> customerId.equalsIgnoreCase(o.getCustomerId()))
                    .collect(Collectors.toList());
        }

        if (status != null) {
            orders = orders.stream()
                    .filter(o -> status.equalsIgnoreCase(o.getStatus()))
                    .collect(Collectors.toList());
        }

        List<OrderResponse> responses = orders.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());

        return ResponseEntity.ok(responses);
    }

    @GetMapping("/{id}")
    public ResponseEntity<OrderResponse> getOrder(@PathVariable String id) {
        return orderRepository.findById(id)
                .map(order -> ResponseEntity.ok(mapToResponse(order)))
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }

    private OrderResponse mapToResponse(OrderEntity order) {
        OrderResponse response = new OrderResponse();
        response.setOrderId(order.getId());
        response.setCustomerId(order.getCustomerId());
        response.setAmount(order.getAmount());
        response.setStatus(order.getStatus());
        response.setPaymentStatus(order.getPaymentStatus());
        response.setPaymentMethod(order.getPaymentMethod());
        response.setDeliveryPartnerId(order.getDeliveryPartnerId());
        response.setCreatedAt(order.getCreatedAt());
        response.setItems(order.getItems());
        response.setAddress(order.getAddress());
        response.setMessage("Order status: " + order.getStatus() 
                + " (Payment: " + order.getPaymentStatus()
                + ", Method: " + order.getPaymentMethod()
                + ", Ticket: " + order.getTicketId() 
                + ", Delivery: " + order.getDeliveryId() + ")");

        // Load items details
        List<OrderItemEntity> itemEntities = orderItemRepository.findByOrderId(order.getId());
        if (itemEntities != null && !itemEntities.isEmpty()) {
            List<OrderResponse.OrderItemResponseDto> itemDtos = itemEntities.stream()
                    .map(item -> new OrderResponse.OrderItemResponseDto(
                            item.getFoodId(),
                            item.getName(),
                            item.getQuantity(),
                            item.getPrice()
                    ))
                    .collect(Collectors.toList());
            response.setItemDetails(itemDtos);
        }
        return response;
    }
}
