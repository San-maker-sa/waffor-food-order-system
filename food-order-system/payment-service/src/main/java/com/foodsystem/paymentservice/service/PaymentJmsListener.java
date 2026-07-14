package com.foodsystem.paymentservice.service;

import com.foodsystem.paymentservice.dto.PaymentMessage;
import com.foodsystem.paymentservice.entity.PaymentEntity;
import com.foodsystem.paymentservice.repository.PaymentRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.jms.annotation.JmsListener;
import org.springframework.jms.core.JmsTemplate;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class PaymentJmsListener {

    private final PaymentRepository paymentRepository;
    private final JmsTemplate jmsTemplate;

    @JmsListener(destination = "payment-request-queue")
    public void receivePaymentRequest(PaymentMessage message) {
        log.info("[PaymentService] Order #{} - Received payment request, Action/Status: {}, Amount: {}", 
                message.getOrderId(), message.getStatus(), message.getAmount());

        try {
            if ("REFUNDED".equalsIgnoreCase(message.getStatus())) {
                processRefund(message);
            } else {
                processPayment(message);
            }
        } catch (Exception e) {
            log.error("[PaymentService] Order #{} - Error processing payment message: ", message.getOrderId(), e);
            message.setStatus("FAILED");
            message.setMessage("System Exception: " + e.getMessage());
            sendResponse(message);
        }
    }

    private void processPayment(PaymentMessage message) {
        // Business Rule: Negative/zero amount, or special mock amount (e.g., 999.0) will fail payment
        boolean isSuccessful = message.getAmount() > 0 && message.getAmount() != 999.0;

        PaymentEntity payment = new PaymentEntity();
        payment.setOrderId(message.getOrderId());
        payment.setAmount(message.getAmount());
        
        if (isSuccessful) {
            payment.setStatus("SUCCESS");
            payment.setTransactionId("TX-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
            
            paymentRepository.save(payment);
            
            message.setPaymentId(payment.getTransactionId());
            message.setStatus("SUCCESS");
            message.setMessage("Payment authorized successfully.");
            log.info("[PaymentService] Order #{} - Payment authorized with TX: {}", message.getOrderId(), payment.getTransactionId());
        } else {
            payment.setStatus("FAILED");
            paymentRepository.save(payment);
            
            message.setStatus("FAILED");
            message.setMessage("Payment authorization failed (insufficient funds or invalid amount).");
            log.warn("[PaymentService] Order #{} - Payment authorization failed", message.getOrderId());
        }

        sendResponse(message);
    }

    private void processRefund(PaymentMessage message) {
        paymentRepository.findByOrderId(message.getOrderId()).ifPresentOrElse(
            payment -> {
                payment.setStatus("REFUNDED");
                paymentRepository.save(payment);
                log.info("[PaymentService] Order #{} - Payment refunded", message.getOrderId());
                message.setStatus("REFUNDED");
                message.setMessage("Payment refunded successfully.");
            },
            () -> {
                log.warn("[PaymentService] Order #{} - No payment found to refund", message.getOrderId());
                message.setStatus("REFUND_FAILED");
                message.setMessage("Refund failed: Payment record not found.");
            }
        );

        sendResponse(message);
    }

    private void sendResponse(PaymentMessage message) {
        log.info("[PaymentService] Order #{} - Sending payment response with Status: {}", 
                message.getOrderId(), message.getStatus());
        jmsTemplate.convertAndSend("payment-response-queue", message);
    }
}
