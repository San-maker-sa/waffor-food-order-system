package com.foodsystem.paymentservice.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PaymentMessage implements Serializable {
    private static final long serialVersionUID = 1L;

    private String orderId;
    private String paymentId;
    private double amount;
    private String status; // PENDING, SUCCESS, FAILED, REFUNDED
    private String message;
}
