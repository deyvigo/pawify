package com.example.pawify.repository;

import com.example.pawify.model.AddressEntity;
import com.example.pawify.model.BuyerEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AddressRepository extends JpaRepository<AddressEntity, Long> {
    List<AddressEntity> findAllByBuyerAndActiveTrue(BuyerEntity buyerEntity);
}
