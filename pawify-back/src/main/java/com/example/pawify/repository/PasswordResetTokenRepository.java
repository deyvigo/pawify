package com.example.pawify.repository;

import com.example.pawify.model.PasswordResetTokenEntity;
import com.example.pawify.model.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PasswordResetTokenRepository extends JpaRepository<PasswordResetTokenEntity, Long> {
    void deleteAllByUserAndUsedFalse(UserEntity user);
    Optional<PasswordResetTokenEntity> findByUserAndUsedFalse(UserEntity user);
}
