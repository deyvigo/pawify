package com.example.pawify.service;

import com.example.pawify.dto.in.buyer.UpdateBuyerRequestDTO;
import com.example.pawify.dto.out.user.BuyerImageResponseDTO;
import com.example.pawify.dto.out.user.BuyerResponseSimpleDTO;
import com.example.pawify.dto.out.user.UpdateBuyerResponseDTO;
import com.example.pawify.model.BuyerEntity;
import org.springframework.web.multipart.MultipartFile;

public interface BuyerService {
    BuyerResponseSimpleDTO getBuyer(BuyerEntity buyerEntity);
    BuyerImageResponseDTO createOrUpdateImage(BuyerEntity buyerEntity, MultipartFile image);
    UpdateBuyerResponseDTO updateBuyer(BuyerEntity buyerEntity, UpdateBuyerRequestDTO updateBuyerRequestDTO);
}
