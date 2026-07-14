package com.foodsystem.orderservice.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderResponse {
    private String orderId;
    private String customerId;
    private double amount;
    private String status;
    private String paymentStatus;
    private String deliveryPartnerId;
    private LocalDateTime createdAt;
    private String items;
    private String address;
    private String paymentMethod; // CARD, UPI, COD
    private String message;
    private List<OrderItemResponseDto> itemDetails;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class OrderItemResponseDto {
        private String foodId;
        private String name;
        private int quantity;
        private double price;
    }
}
