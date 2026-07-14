package com.foodsystem.deliveryservice.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "deliveries")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class DeliveryEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String orderId;

    @Column(nullable = false)
    private String address;

    @Column(nullable = false)
    private String status; // ASSIGNED, DELIVERED, FAILED

    private String deliveryId;

    private String driverName;

    private String paymentMethod; // CARD, UPI, COD

    private double amountToCollect; // Amount to collect for COD orders
}
