package com.example.pawify.repository;

import com.example.pawify.model.ProductEntity;
import jakarta.persistence.LockModeType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProductRepository extends
    JpaRepository<ProductEntity, Long>, JpaSpecificationExecutor<ProductEntity> {
    boolean existsByShareCode(String shareCode);
    Page<ProductEntity> findAll(Specification<ProductEntity> specs, Pageable pageable);
    Optional<ProductEntity> findByShareCode(String shareCode);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("""
        SELECT p FROM ProductEntity p
        LEFT JOIN FETCH p.images
        WHERE p.id IN :ids
    """)
    List<ProductEntity> findAllByIdForUpdate(List<Long> ids);
}
