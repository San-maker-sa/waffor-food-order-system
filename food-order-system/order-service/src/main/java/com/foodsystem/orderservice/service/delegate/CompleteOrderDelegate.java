package com.foodsystem.orderservice.service.delegate;

import com.foodsystem.orderservice.entity.OrderEntity;
import com.foodsystem.orderservice.repository.OrderRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.camunda.bpm.engine.delegate.DelegateExecution;
import org.camunda.bpm.engine.delegate.JavaDelegate;
import org.springframework.stereotype.Component;

@Component("completeOrderDelegate")
@RequiredArgsConstructor
@Slf4j
public class CompleteOrderDelegate implements JavaDelegate {

    private final OrderRepository orderRepository;

    @Override
    public void execute(DelegateExecution execution) throws Exception {
        String orderId = execution.getProcessBusinessKey();
        log.info("Camunda Process {}: CompleteOrderDelegate executing (Order Completed)", orderId);

        OrderEntity order = orderRepository.findById(orderId)
                .orElseThrow(() -> new IllegalArgumentException("Order not found with ID: " + orderId));

        order.setStatus("DELIVERED");
        orderRepository.save(order);
        log.info("Order ID: {} successfully completed and persisted.", orderId);
    }
}
