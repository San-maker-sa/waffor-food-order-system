package com.foodsystem.kitchenservice.repository;

import com.foodsystem.kitchenservice.entity.KitchenTicketEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface KitchenTicketRepository extends JpaRepository<KitchenTicketEntity, Long> {
    Optional<KitchenTicketEntity> findByOrderId(String orderId);
}
