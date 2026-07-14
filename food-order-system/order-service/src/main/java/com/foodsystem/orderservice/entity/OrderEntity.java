package com.foodsystem.orderservice.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "orders")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderEntity {

    @Id
    @Column(name = "order_id")
    private String id; // UUID string representation

    @Column(name = "customer_id", nullable = false)
    private String customerId;

    @Column(name = "total_amount", nullable = false)
    private double amount;

    @Column(name = "order_status", nullable = false)
    private String status; // PLACED, PAYMENT_COMPLETED, PREPARING, READY_FOR_DELIVERY, OUT_FOR_DELIVERY, DELIVERED

    @Column(name = "payment_status", nullable = false)
    private String paymentStatus; // PENDING, PAID

    @Column(name = "delivery_partner_id")
    private String deliveryPartnerId;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @Column(nullable = false, length = 1000)
    private String items;

    @Column(nullable = false)
    private String address;

    private String paymentId;

    private String ticketId;

    private String deliveryId;

    private String paymentMethod; // CARD, UPI, COD
}
