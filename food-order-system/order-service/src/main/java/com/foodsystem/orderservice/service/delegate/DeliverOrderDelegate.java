package com.foodsystem.orderservice.service.delegate;

import com.foodsystem.orderservice.dto.DeliveryMessage;
import com.foodsystem.orderservice.entity.OrderEntity;
import com.foodsystem.orderservice.repository.OrderRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.camunda.bpm.engine.delegate.DelegateExecution;
import org.camunda.bpm.engine.delegate.JavaDelegate;
import org.springframework.jms.core.JmsTemplate;
import org.springframework.stereotype.Component;

@Component("deliverOrderDelegate")
@RequiredArgsConstructor
@Slf4j
public class DeliverOrderDelegate implements JavaDelegate {

    private final OrderRepository orderRepository;
    private final JmsTemplate jmsTemplate;

    @Override
    public void execute(DelegateExecution execution) throws Exception {
        String orderId = execution.getProcessBusinessKey();
        log.info("[OrderService] Order #{} - DeliverOrderDelegate executing", orderId);

        OrderEntity order = orderRepository.findById(orderId)
                .orElseThrow(() -> new IllegalArgumentException("Order not found with ID: " + orderId));

        // Update local order status
        order.setStatus("OUT_FOR_DELIVERY");
        orderRepository.save(order);

        DeliveryMessage deliveryMessage = new DeliveryMessage();
        deliveryMessage.setOrderId(orderId);
        deliveryMessage.setAddress(order.getAddress());
        deliveryMessage.setStatus("PENDING");
        deliveryMessage.setPaymentMethod(order.getPaymentMethod());
        deliveryMessage.setAmount(order.getAmount());

        log.info("[OrderService] Order #{} - Sending delivery request to delivery-request-queue (Payment: {})", orderId, order.getPaymentMethod());
        jmsTemplate.convertAndSend("delivery-request-queue", deliveryMessage);
    }
}
