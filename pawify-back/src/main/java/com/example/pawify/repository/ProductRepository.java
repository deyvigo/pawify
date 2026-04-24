package com.example.pawify.repository;

import com.example.pawify.model.ProductEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.Optional;

public interface ProductRepository extends
    JpaRepository<ProductEntity, Long>, JpaSpecificationExecutor<ProductEntity> {
    boolean existsByShareCode(String shareCode);
    Page<ProductEntity> findAll(Specification<ProductEntity> specs, Pageable pageable);
    Optional<ProductEntity> findByShareCode(String shareCode);
}
