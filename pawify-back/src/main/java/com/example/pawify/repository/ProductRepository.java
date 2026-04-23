package com.example.pawify.repository;

import com.example.pawify.model.ProductEntity;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductRepository extends JpaRepository<ProductEntity, Long> {
    boolean existsByShareCode(String shareCode);
    Slice<ProductEntity> findAllBy(Pageable pageable);
}
