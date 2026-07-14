package com.foodsystem.orderservice.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderRequest {
    private String customerId;
    private double amount;
    private String items;
    private String address;
    private List<OrderItemDto> itemDetails;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class OrderItemDto {
        private String foodId;
        private String name;
        private int quantity;
        private double price;
    }
}
