package com.example.pawify.repository;

import com.example.pawify.model.RoleEntity;
import com.example.pawify.model.RoleEnum;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RoleRepository extends JpaRepository<RoleEntity, Long> {
    Optional<RoleEntity> findByRole(RoleEnum roleEnum);

    RoleEntity role(RoleEnum role);
}
