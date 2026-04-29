package com.example.pawify.repository;

import com.example.pawify.model.BuyerEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface BuyerRepository extends JpaRepository<BuyerEntity, Long> {
    Optional<BuyerEntity> findByUsername(String username);
    boolean existsByEmail(String email);
}
