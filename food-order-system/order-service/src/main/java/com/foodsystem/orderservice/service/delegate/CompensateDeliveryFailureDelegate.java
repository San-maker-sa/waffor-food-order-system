package com.foodsystem.orderservice.service.delegate;

import com.foodsystem.orderservice.dto.KitchenMessage;
import com.foodsystem.orderservice.dto.PaymentMessage;
import com.foodsystem.orderservice.entity.OrderEntity;
import com.foodsystem.orderservice.repository.OrderRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.camunda.bpm.engine.delegate.DelegateExecution;
import org.camunda.bpm.engine.delegate.JavaDelegate;
import org.springframework.jms.core.JmsTemplate;
import org.springframework.stereotype.Component;

@Component("compensateDeliveryFailureDelegate")
@RequiredArgsConstructor
@Slf4j
public class CompensateDeliveryFailureDelegate implements JavaDelegate {

    private final OrderRepository orderRepository;
    private final JmsTemplate jmsTemplate;

    @Override
    public void execute(DelegateExecution execution) throws Exception {
        String orderId = execution.getProcessBusinessKey();
        log.info("[OrderService] Order #{} - CompensateDeliveryFailureDelegate executing (Reverting Kitchen & Payment)", orderId);

        OrderEntity order = orderRepository.findById(orderId)
                .orElseThrow(() -> new IllegalArgumentException("Order not found with ID: " + orderId));

        // Update local order status
        order.setStatus("CANCELLED");
        orderRepository.save(order);

        // Send Kitchen Cancellation
        KitchenMessage kitchenMessage = new KitchenMessage();
        kitchenMessage.setOrderId(orderId);
        kitchenMessage.setStatus("CANCELLED");
        log.info("[OrderService] Order #{} - Sending kitchen cancel request to kitchen-request-queue", orderId);
        jmsTemplate.convertAndSend("kitchen-request-queue", kitchenMessage);

        // Send Payment Refund
        PaymentMessage paymentMessage = new PaymentMessage();
        paymentMessage.setOrderId(orderId);
        paymentMessage.setAmount(order.getAmount());
        paymentMessage.setStatus("REFUNDED");
        log.info("[OrderService] Order #{} - Sending payment refund request to payment-request-queue", orderId);
        jmsTemplate.convertAndSend("payment-request-queue", paymentMessage);
    }
}
