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

@RestController
@RequestMapping("/review")
@AllArgsConstructor
public class ReviewController {
    private final ReviewService reviewService;

    @PostMapping("")
    public ResponseEntity<ReviewResponseDTO> createReview(
        @AuthenticationPrincipal BuyerEntity buyerEntity,
        @Valid @RequestPart("data") ReviewCreateRequestDTO reviewCreateRequestDTO,
        @RequestParam(value = "images", required = false)List<MultipartFile> images
    ) {
        return ResponseEntity.ok(reviewService.createReview(buyerEntity, reviewCreateRequestDTO, images));
    }

    @GetMapping("/product/{productId}")
    public ResponseEntity<Slice<ReviewResponseDTO>> getAllReviewsByProductId(
        @PathVariable Long productId,
        Pageable pageable
    ) {
        return ResponseEntity.ok(reviewService.getReviewByProductId(productId, pageable));
    }
}
