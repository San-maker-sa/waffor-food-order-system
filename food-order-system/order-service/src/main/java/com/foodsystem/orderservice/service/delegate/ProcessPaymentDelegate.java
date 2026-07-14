package com.foodsystem.orderservice.service.delegate;

import com.foodsystem.orderservice.dto.PaymentMessage;
import com.foodsystem.orderservice.entity.OrderEntity;
import com.foodsystem.orderservice.repository.OrderRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.camunda.bpm.engine.delegate.DelegateExecution;
import org.camunda.bpm.engine.delegate.JavaDelegate;
import org.springframework.jms.core.JmsTemplate;
import org.springframework.stereotype.Component;

@Component("processPaymentDelegate")
@RequiredArgsConstructor
@Slf4j
public class ProcessPaymentDelegate implements JavaDelegate {

    private final OrderRepository orderRepository;
    private final JmsTemplate jmsTemplate;

    @Override
    public void execute(DelegateExecution execution) throws Exception {
        String orderId = execution.getProcessBusinessKey();
        log.info("[OrderService] Order #{} - ProcessPaymentDelegate executing", orderId);

        OrderEntity order = orderRepository.findById(orderId)
                .orElseThrow(() -> new IllegalArgumentException("Order not found with ID: " + orderId));

        PaymentMessage paymentMessage = new PaymentMessage();
        paymentMessage.setOrderId(orderId);
        paymentMessage.setAmount(order.getAmount());
        paymentMessage.setStatus("PENDING");

        log.info("[OrderService] Order #{} - Sending payment request to payment-request-queue", orderId);
        jmsTemplate.convertAndSend("payment-request-queue", paymentMessage);
    }
}
