package com.foodsystem.orderservice.service;

import com.foodsystem.orderservice.dto.DeliveryMessage;
import com.foodsystem.orderservice.dto.KitchenMessage;
import com.foodsystem.orderservice.dto.PaymentMessage;
import com.foodsystem.orderservice.repository.OrderRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.camunda.bpm.engine.RuntimeService;
import org.springframework.jms.annotation.JmsListener;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class JmsResponseListener {

    private final OrderRepository orderRepository;
    private final RuntimeService runtimeService;

    @JmsListener(destination = "payment-response-queue")
    public void receivePaymentResponse(PaymentMessage message) {
        log.info("[OrderService] Order #{} - Received Payment Response with Status: {}",
                message.getOrderId(), message.getStatus());

        try {
            orderRepository.findById(message.getOrderId()).ifPresent(order -> {
                order.setPaymentId(message.getPaymentId());
                orderRepository.save(order);
            });

            runtimeService.createMessageCorrelation("PaymentResponseMessage")
                    .processInstanceBusinessKey(message.getOrderId())
                    .setVariable("paymentStatus", message.getStatus())
                    .correlate();
            log.info("[OrderService] Order #{} - Correlated PaymentResponseMessage", message.getOrderId());
        } catch (Exception e) {
            log.error("[OrderService] Order #{} - Failed to correlate PaymentResponseMessage: ", message.getOrderId(),
                    e);
        }
    }

    @JmsListener(destination = "kitchen-response-queue")
    public void receiveKitchenResponse(KitchenMessage message) {
        log.info("[OrderService] Order #{} - Received Kitchen Response with Status: {}",
                message.getOrderId(), message.getStatus());

        try {
            orderRepository.findById(message.getOrderId()).ifPresent(order -> {
                order.setTicketId(message.getTicketId());
                orderRepository.save(order);
            });

            // If kitchen rejected the order, trigger immediate correlation so compensation
            // workflow runs.
            if (!"ACCEPTED".equalsIgnoreCase(message.getStatus())) {
                runtimeService.createMessageCorrelation("KitchenResponseMessage")
                        .processInstanceBusinessKey(message.getOrderId())
                        .setVariable("kitchenStatus", message.getStatus())
                        .correlate();
                log.info(
                        "[OrderService] Order #{} - Kitchen rejected. Correlated KitchenResponseMessage for Saga cancellation.",
                        message.getOrderId());
            } else {
                log.info(
                        "[OrderService] Order #{} - Kitchen accepted. Awaiting manual Shop Keeper acceptance & preparation.",
                        message.getOrderId());
            }
        } catch (Exception e) {
            log.error("[OrderService] Order #{} - Failed to process Kitchen Response: ", message.getOrderId(), e);
        }
    }

    @JmsListener(destination = "delivery-response-queue")
    public void receiveDeliveryResponse(DeliveryMessage message) {
        log.info("[OrderService] Order #{} - Received Delivery Response with Status: {}",
                message.getOrderId(), message.getStatus());

        try {
            orderRepository.findById(message.getOrderId()).ifPresent(order -> {
                order.setDeliveryId(message.getDeliveryId());
                order.setDeliveryPartnerId(message.getDeliveryId()); // Use delivery ID as partner identifier
                orderRepository.save(order);
            });

            // If delivery failed, correlate immediately for Saga rollback
            if ("FAILED".equalsIgnoreCase(message.getStatus())) {
                runtimeService.createMessageCorrelation("DeliveryResponseMessage")
                        .processInstanceBusinessKey(message.getOrderId())
                        .setVariable("deliveryStatus", message.getStatus())
                        .correlate();
                log.info(
                        "[OrderService] Order #{} - Delivery failed. Correlated DeliveryResponseMessage for Saga cancellation.",
                        message.getOrderId());
            } else {
                log.info(
                        "[OrderService] Order #{} - Delivery dispatch pending. Awaiting Delivery Partner confirmation.",
                        message.getOrderId());
            }
        } catch (Exception e) {
            log.error("[OrderService] Order #{} - Failed to process Delivery Response: ", message.getOrderId(), e);
        }
    }
}
