package com.example.pawify.repository;

import com.example.pawify.model.OrderEntity;
import com.example.pawify.model.TrackingStatusEntity;
import org.springframework.data.domain.Limit;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TrackingStatusRepository extends JpaRepository<TrackingStatusEntity, Long> {
    List<TrackingStatusEntity> findAllByOrderOrderByTimestampDesc(OrderEntity order, Limit limit); // first page

    List<TrackingStatusEntity> findAllByOrderAndIdLessThanOrderByTimestampDesc(OrderEntity order, Long idIsLessThan, Limit limit);
}
