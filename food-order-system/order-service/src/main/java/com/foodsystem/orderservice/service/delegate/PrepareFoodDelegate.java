package com.foodsystem.orderservice.service.delegate;

import com.foodsystem.orderservice.dto.KitchenMessage;
import com.foodsystem.orderservice.entity.OrderEntity;
import com.foodsystem.orderservice.repository.OrderRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.camunda.bpm.engine.delegate.DelegateExecution;
import org.camunda.bpm.engine.delegate.JavaDelegate;
import org.springframework.jms.core.JmsTemplate;
import org.springframework.stereotype.Component;

@Component("prepareFoodDelegate")
@RequiredArgsConstructor
@Slf4j
public class PrepareFoodDelegate implements JavaDelegate {

    private final OrderRepository orderRepository;
    private final JmsTemplate jmsTemplate;

    @Override
    public void execute(DelegateExecution execution) throws Exception {
        String orderId = execution.getProcessBusinessKey();
        log.info("[OrderService] Order #{} - PrepareFoodDelegate executing", orderId);

        OrderEntity order = orderRepository.findById(orderId)
                .orElseThrow(() -> new IllegalArgumentException("Order not found with ID: " + orderId));

        // Update local order status
        order.setStatus("PAYMENT_COMPLETED");
        orderRepository.save(order);

        KitchenMessage kitchenMessage = new KitchenMessage();
        kitchenMessage.setOrderId(orderId);
        kitchenMessage.setItems(order.getItems());
        kitchenMessage.setStatus("PENDING");

        log.info("[OrderService] Order #{} - Sending kitchen preparation request to kitchen-request-queue", orderId);
        jmsTemplate.convertAndSend("kitchen-request-queue", kitchenMessage);
    }
}
