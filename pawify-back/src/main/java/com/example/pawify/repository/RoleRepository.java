package com.example.pawify.repository;

import com.example.pawify.model.RoleEntity;
import com.example.pawify.model.RoleEnum;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface RoleRepository extends JpaRepository<RoleEntity, Long> {
    Optional<RoleEntity> findByRole(RoleEnum roleEnum);

    RoleEntity role(RoleEnum role);
}
