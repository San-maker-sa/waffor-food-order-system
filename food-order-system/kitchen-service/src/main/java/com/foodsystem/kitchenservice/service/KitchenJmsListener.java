package com.foodsystem.kitchenservice.service;

import com.foodsystem.kitchenservice.dto.KitchenMessage;
import com.foodsystem.kitchenservice.entity.KitchenTicketEntity;
import com.foodsystem.kitchenservice.repository.KitchenTicketRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.jms.annotation.JmsListener;
import org.springframework.jms.core.JmsTemplate;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class KitchenJmsListener {

    private final KitchenTicketRepository kitchenTicketRepository;
    private final JmsTemplate jmsTemplate;

    @JmsListener(destination = "kitchen-request-queue")
    public void receiveKitchenRequest(KitchenMessage message) {
        log.info("[KitchenService] Order #{} - Received kitchen request, Action/Status: {}, Items: {}", 
                message.getOrderId(), message.getStatus(), message.getItems());

        try {
            if ("CANCELLED".equalsIgnoreCase(message.getStatus())) {
                processCancellation(message);
            } else {
                processTicket(message);
            }
        } catch (Exception e) {
            log.error("[KitchenService] Order #{} - Error processing kitchen message: ", message.getOrderId(), e);
            message.setStatus("REJECTED");
            message.setMessage("System Exception: " + e.getMessage());
            sendResponse(message);
        }
    }

    private void processTicket(KitchenMessage message) {
        // Business Rule: Items containing "fail" or "reject" will be rejected by the kitchen
        boolean isAccepted = message.getItems() != null && 
                             !message.getItems().toLowerCase().contains("fail") &&
                             !message.getItems().toLowerCase().contains("reject");

        KitchenTicketEntity ticket = new KitchenTicketEntity();
        ticket.setOrderId(message.getOrderId());
        ticket.setItems(message.getItems());

        if (isAccepted) {
            ticket.setStatus("ACCEPTED");
            ticket.setTicketId("TKT-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
            
            kitchenTicketRepository.save(ticket);

            message.setTicketId(ticket.getTicketId());
            message.setStatus("ACCEPTED");
            message.setMessage("Kitchen accepted order and started preparation.");
            log.info("[KitchenService] Order #{} - Kitchen ticket accepted with Ticket ID: {}", message.getOrderId(), ticket.getTicketId());
        } else {
            ticket.setStatus("REJECTED");
            kitchenTicketRepository.save(ticket);

            message.setStatus("REJECTED");
            message.setMessage("Kitchen rejected order (item out of stock or invalid items).");
            log.warn("[KitchenService] Order #{} - Kitchen ticket rejected", message.getOrderId());
        }

        sendResponse(message);
    }

    private void processCancellation(KitchenMessage message) {
        kitchenTicketRepository.findByOrderId(message.getOrderId()).ifPresentOrElse(
            ticket -> {
                ticket.setStatus("CANCELLED");
                kitchenTicketRepository.save(ticket);
                log.info("[KitchenService] Order #{} - Kitchen ticket cancelled", message.getOrderId());
                message.setStatus("CANCELLED");
                message.setMessage("Kitchen preparation cancelled successfully.");
            },
            () -> {
                log.warn("[KitchenService] Order #{} - No kitchen ticket found to cancel", message.getOrderId());
                message.setStatus("CANCEL_FAILED");
                message.setMessage("Cancellation failed: Ticket not found.");
            }
        );

        sendResponse(message);
    }

    private void sendResponse(KitchenMessage message) {
        log.info("[KitchenService] Order #{} - Sending kitchen response with Status: {}", 
                message.getOrderId(), message.getStatus());
        jmsTemplate.convertAndSend("kitchen-response-queue", message);
    }
}
