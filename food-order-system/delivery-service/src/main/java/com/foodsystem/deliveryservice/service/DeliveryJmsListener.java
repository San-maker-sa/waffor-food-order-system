package com.foodsystem.deliveryservice.service;

import com.foodsystem.deliveryservice.dto.DeliveryMessage;
import com.foodsystem.deliveryservice.entity.DeliveryEntity;
import com.foodsystem.deliveryservice.repository.DeliveryRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.jms.annotation.JmsListener;
import org.springframework.jms.core.JmsTemplate;
import org.springframework.stereotype.Service;

import java.util.Random;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class DeliveryJmsListener {

    private final DeliveryRepository deliveryRepository;
    private final JmsTemplate jmsTemplate;
    private final Random random = new Random();
    
    private final String[] drivers = {"John Doe", "Jane Smith", "Bob Johnson", "Alice Brown"};

    @JmsListener(destination = "delivery-request-queue")
    public void receiveDeliveryRequest(DeliveryMessage message) {
        log.info("[DeliveryService] Order #{} - Received delivery request, Action/Status: {}, Address: {}", 
                message.getOrderId(), message.getStatus(), message.getAddress());

        try {
            if ("CANCELLED".equalsIgnoreCase(message.getStatus())) {
                processCancellation(message);
            } else if ("DELIVERED".equalsIgnoreCase(message.getStatus())) {
                processMarkDelivered(message);
            } else {
                processDelivery(message);
            }
        } catch (Exception e) {
            log.error("[DeliveryService] Order #{} - Error processing delivery message: ", message.getOrderId(), e);
            message.setStatus("FAILED");
            message.setMessage("System Exception: " + e.getMessage());
            sendResponse(message);
        }
    }

    private void processDelivery(DeliveryMessage message) {
        // Business Rule: Address containing "fail" or "unknown" will fail delivery assignment
        boolean isSuccess = message.getAddress() != null && 
                            !message.getAddress().toLowerCase().contains("fail") &&
                            !message.getAddress().toLowerCase().contains("unknown");

        DeliveryEntity delivery = new DeliveryEntity();
        delivery.setOrderId(message.getOrderId());
        delivery.setAddress(message.getAddress());
        delivery.setPaymentMethod(message.getPaymentMethod());
        delivery.setAmountToCollect("COD".equalsIgnoreCase(message.getPaymentMethod()) ? message.getAmount() : 0);

        if (isSuccess) {
            String driverName = drivers[random.nextInt(drivers.length)];
            delivery.setDriverName(driverName);
            delivery.setStatus("PENDING");
            delivery.setDeliveryId("DEL-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
            
            deliveryRepository.save(delivery);

            message.setDeliveryId(delivery.getDeliveryId());
            message.setStatus("PENDING");
            String codNote = "COD".equalsIgnoreCase(message.getPaymentMethod()) 
                    ? " [COD: Collect ₹" + message.getAmount() + " from customer]" 
                    : "";
            message.setMessage("Delivery assigned to driver: " + driverName + codNote);
            log.info("[DeliveryService] Order #{} - Delivery assigned with Delivery ID: {} (Driver: {}, Payment: {})", 
                    message.getOrderId(), delivery.getDeliveryId(), driverName, message.getPaymentMethod());
        } else {
            delivery.setStatus("FAILED");
            deliveryRepository.save(delivery);

            message.setStatus("FAILED");
            message.setMessage("Delivery failed: Address could not be reached or no drivers available.");
            log.warn("[DeliveryService] Order #{} - Delivery failed", message.getOrderId());
        }

        sendResponse(message);
    }

    private void processMarkDelivered(DeliveryMessage message) {
        deliveryRepository.findByOrderId(message.getOrderId()).ifPresentOrElse(
            delivery -> {
                delivery.setStatus("DELIVERED");
                deliveryRepository.save(delivery);
                log.info("[DeliveryService] Order #{} - Delivery record updated to DELIVERED", message.getOrderId());
                message.setStatus("DELIVERED");
                message.setMessage("Delivery marked DELIVERED successfully.");
            },
            () -> {
                log.warn("[DeliveryService] Order #{} - No delivery found to update to DELIVERED, creating new", message.getOrderId());
                DeliveryEntity delivery = new DeliveryEntity();
                delivery.setOrderId(message.getOrderId());
                delivery.setStatus("DELIVERED");
                delivery.setDriverName(drivers[random.nextInt(drivers.length)]);
                delivery.setDeliveryId(message.getDeliveryId() != null ? message.getDeliveryId() : "DEL-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
                delivery.setAddress(message.getAddress() != null ? message.getAddress() : "Unknown");
                deliveryRepository.save(delivery);
                message.setDeliveryId(delivery.getDeliveryId());
                message.setStatus("DELIVERED");
            }
        );
    }

    private void processCancellation(DeliveryMessage message) {
        deliveryRepository.findByOrderId(message.getOrderId()).ifPresentOrElse(
            delivery -> {
                delivery.setStatus("CANCELLED");
                deliveryRepository.save(delivery);
                log.info("[DeliveryService] Order #{} - Delivery cancelled", message.getOrderId());
                message.setStatus("CANCELLED");
                message.setMessage("Delivery cancelled successfully.");
            },
            () -> {
                log.warn("[DeliveryService] Order #{} - No delivery found to cancel", message.getOrderId());
                message.setStatus("CANCEL_FAILED");
                message.setMessage("Cancellation failed: Delivery record not found.");
            }
        );

        sendResponse(message);
    }

    private void sendResponse(DeliveryMessage message) {
        log.info("[DeliveryService] Order #{} - Sending delivery response with Status: {}", 
                message.getOrderId(), message.getStatus());
        jmsTemplate.convertAndSend("delivery-response-queue", message);
    }
}
