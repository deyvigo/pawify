package com.example.pawify.repository;

import com.example.pawify.model.BuyerEntity;
import com.example.pawify.model.OrderEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface OrderRepository extends JpaRepository<OrderEntity, Long> {
    Page<OrderEntity> findAllByBuyer(BuyerEntity buyerEntity, Pageable pageable);
    boolean existsByTrackingCode(String trackingCode);
    Optional<OrderEntity> findByTrackingCode(String trackingCode);
}
