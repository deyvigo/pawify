package com.example.pawify.service;

import com.example.pawify.dto.out.user.BuyerResponseSimpleDTO;
import com.example.pawify.model.BuyerEntity;

public interface BuyerService {
    BuyerResponseSimpleDTO getBuyer(BuyerEntity buyerEntity);
}
