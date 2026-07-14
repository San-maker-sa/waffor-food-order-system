package com.foodsystem.deliveryservice.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DeliveryMessage implements Serializable {
    private static final long serialVersionUID = 1L;

    private String orderId;
    private String deliveryId;
    private String address;
    private String status; // PENDING, ASSIGNED, DELIVERED, FAILED
    private String message;
    private String paymentMethod; // CARD, UPI, COD
    private double amount;
}
