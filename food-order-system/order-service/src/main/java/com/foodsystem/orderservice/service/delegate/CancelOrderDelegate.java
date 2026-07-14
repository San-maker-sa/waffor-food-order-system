package com.foodsystem.orderservice.service.delegate;

import com.foodsystem.orderservice.entity.OrderEntity;
import com.foodsystem.orderservice.repository.OrderRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.camunda.bpm.engine.delegate.DelegateExecution;
import org.camunda.bpm.engine.delegate.JavaDelegate;
import org.springframework.stereotype.Component;

@Component("cancelOrderDelegate")
@RequiredArgsConstructor
@Slf4j
public class CancelOrderDelegate implements JavaDelegate {

    private final OrderRepository orderRepository;

    @Override
    public void execute(DelegateExecution execution) throws Exception {
        String orderId = execution.getProcessBusinessKey();
        log.info("[OrderService] Order #{} - CancelOrderDelegate executing (Payment Failed - Order Cancelled)", orderId);

        OrderEntity order = orderRepository.findById(orderId)
                .orElseThrow(() -> new IllegalArgumentException("Order not found with ID: " + orderId));

        order.setStatus("CANCELLED");
        orderRepository.save(order);
        log.info("[OrderService] Order #{} - Status set to CANCELLED", orderId);
    }
}
