package com.example.pawify.repository;

import com.example.pawify.model.BuyerEntity;
import com.example.pawify.model.OrderEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface OrderRepository extends JpaRepository<OrderEntity, Long> {
    Page<OrderEntity> findAllByBuyer(BuyerEntity buyerEntity, Pageable pageable);
    boolean existsByTrackingCode(String trackingCode);
    Optional<OrderEntity> findByTrackingCode(String trackingCode);
    @Query("""
        SELECT o
        FROM OrderEntity o
        WHERE (:trackingCode IS NULL OR o.trackingCode = :trackingCode)
    """)
    Page<OrderEntity> findAllWithTrackingCodeFilter(
        Pageable pageable, @Param("trackingCode") String trackingCode
    );
}
