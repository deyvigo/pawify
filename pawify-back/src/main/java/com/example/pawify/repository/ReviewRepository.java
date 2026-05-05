package com.example.pawify.repository;

import com.example.pawify.model.ReviewEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ReviewRepository extends JpaRepository<ReviewEntity, Long> {
    boolean existsByDetail_Id(Long id);
}
