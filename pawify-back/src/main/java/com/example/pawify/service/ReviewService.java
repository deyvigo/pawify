package com.example.pawify.service;

import com.example.pawify.dto.in.review.ReviewCreateRequestDTO;
import com.example.pawify.dto.out.review.ReviewResponseDTO;
import com.example.pawify.model.BuyerEntity;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

// Servicio de gestion de reviews de productos
public interface ReviewService {

    // Crea un review con imagenes opcionales validando propiedad del detalle
    ReviewResponseDTO createReview(
        BuyerEntity buyerEntity,
        ReviewCreateRequestDTO reviewCreateRequestDTO,
        List<MultipartFile> images
    );

    // Lista reviews de un producto con paginacion
    Slice<ReviewResponseDTO> getReviewByProductId(
        Long productId,
        Pageable pageable
    );

    // Elimina un review validando que el comprador sea el propietario
    void deleteReview(BuyerEntity entity, Long reviewId);
}
