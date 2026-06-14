package com.example.pawify.repository;

import com.example.pawify.model.ClaimEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ClaimRepository extends JpaRepository<ClaimEntity, Long>, ClaimCustomRepository {
    Optional<ClaimEntity> findByDetail_Id(Long detailId);
}
