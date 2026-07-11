package com.example.pawify.controller;

import com.example.pawify.dto.in.review.ReviewCreateRequestDTO;
import com.example.pawify.dto.out.review.ReviewResponseDTO;
import com.example.pawify.model.BuyerEntity;
import com.example.pawify.service.ReviewService;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

// Controlador de resenas de productos
@RestController
@RequestMapping("/review")
@AllArgsConstructor
public class ReviewController {
    private final ReviewService reviewService;

    // Crea una resena para un producto con imagenes opcionales
    @PostMapping("")
    public ResponseEntity<ReviewResponseDTO> createReview(
        @AuthenticationPrincipal BuyerEntity buyerEntity,
        @Valid @RequestPart("data") ReviewCreateRequestDTO reviewCreateRequestDTO,
        @RequestParam(value = "images", required = false)List<MultipartFile> images
    ) {
        return ResponseEntity.ok(reviewService.createReview(buyerEntity, reviewCreateRequestDTO, images));
    }

    // Lista las resenas de un producto con paginacion
    @GetMapping("/product/{productId}")
    public ResponseEntity<Slice<ReviewResponseDTO>> getAllReviewsByProductId(
        @PathVariable Long productId,
        Pageable pageable
    ) {
        return ResponseEntity.ok(reviewService.getReviewByProductId(productId, pageable));
    }

    // Elimina una resena del comprador autenticado
    @DeleteMapping("/{reviewId}")
    public ResponseEntity<Void> deleteReview(
        @AuthenticationPrincipal BuyerEntity buyerEntity,
        @PathVariable Long reviewId
    ) {
        reviewService.deleteReview(buyerEntity, reviewId);
        return ResponseEntity.noContent().build();
    }
}
