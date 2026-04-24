package com.example.pawify.repository;

import com.example.pawify.model.BrandEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface BrandRepository extends JpaRepository<BrandEntity, Long> {
    Optional<BrandEntity> findByName(String name);
    List<BrandEntity> findByOrderByNameAsc();
}
