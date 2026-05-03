package com.example.pawify.repository;

import com.example.pawify.model.AdminEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AdminRepository extends JpaRepository<AdminEntity, Long> {
    Page<AdminEntity> findAll(Pageable pageable);
}
