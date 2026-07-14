package com.foodsystem.kitchenservice.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "kitchen_tickets")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class KitchenTicketEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String orderId;

    @Column(nullable = false, length = 1000)
    private String items;

    @Column(nullable = false)
    private String status; // ACCEPTED, REJECTED, CANCELLED

    private String ticketId;
}
