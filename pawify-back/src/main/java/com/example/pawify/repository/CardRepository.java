package com.example.pawify.repository;

import com.example.pawify.model.BuyerEntity;
import com.example.pawify.model.CardEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CardRepository extends JpaRepository<CardEntity, Long> {
    List<CardEntity> findAllByBuyerAndActiveTrue(BuyerEntity buyerEntity);
}
