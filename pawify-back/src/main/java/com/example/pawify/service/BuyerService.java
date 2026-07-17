package com.example.pawify.service;

import com.example.pawify.dto.in.buyer.UpdateBuyerRequestDTO;
import com.example.pawify.dto.out.buyer.BuyerImageResponseDTO;
import com.example.pawify.dto.out.buyer.BuyerResponseSimpleDTO;
import com.example.pawify.dto.out.buyer.UpdateBuyerResponseDTO;
import com.example.pawify.model.BuyerEntity;
import org.springframework.web.multipart.MultipartFile;

// Servicio de gestion del perfil de comprador
public interface BuyerService {

    // Obtiene la informacion del perfil de un comprador
    BuyerResponseSimpleDTO getBuyer(BuyerEntity buyerEntity);

    // Sube o actualiza la imagen de perfil en Cloudinary
    BuyerImageResponseDTO createOrUpdateImage(BuyerEntity buyerEntity, MultipartFile image);

    // Actualiza los datos personales del comprador (nombre, email, DNI)
    UpdateBuyerResponseDTO updateBuyer(BuyerEntity buyerEntity, UpdateBuyerRequestDTO updateBuyerRequestDTO);
}
