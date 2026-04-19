package com.example.pawify.repository;

import com.example.pawify.model.BuyerEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BuyerRepository extends JpaRepository<BuyerEntity, Long> {
}
