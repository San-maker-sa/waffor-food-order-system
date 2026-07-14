package com.foodsystem.kitchenservice.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class KitchenMessage implements Serializable {
    private static final long serialVersionUID = 1L;

    private String orderId;
    private String ticketId;
    private String items;
    private String status; // PENDING, ACCEPTED, REJECTED, CANCELLED
    private String message;
}
