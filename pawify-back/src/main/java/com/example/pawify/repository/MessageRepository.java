package com.example.pawify.repository;

import com.example.pawify.model.MessageEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MessageRepository extends JpaRepository<MessageEntity, Long>, MessageRepositoryCustom {
}
