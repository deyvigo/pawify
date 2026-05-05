package com.example.pawify.repository;

import com.example.pawify.model.ReviewEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ReviewRepository extends JpaRepository<ReviewEntity, Long> {
    boolean existsByDetail_Id(Long id);
    Page<ReviewEntity> findAllByProduct_Id(Pageable pageable, Long productId);
}
