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

/**
 * REST controller for product review management operations.
 * <p>
 * Provides endpoints for creating, retrieving, and deleting product reviews.
 * Buyers can create reviews with optional images, and reviews can be
 * queried by product ID or deleted by their owner.
 * </p>
 */
@RestController
@RequestMapping("/review")
@AllArgsConstructor
public class ReviewController {
    private final ReviewService reviewService;

    /**
     * Creates a new review for a product on behalf of the authenticated buyer.
     * <p>
     * Accepts a multipart request with review data as a JSON part and optional images as file parts.
     * </p>
     *
     * @param buyerEntity the authenticated buyer extracted from the security context
     * @param reviewCreateRequestDTO the validated review creation data (product ID, rating, comment)
     * @param images optional list of review images to upload
     * @return {@link ResponseEntity} with HTTP 200 (OK) and the created review data
     */
    @PostMapping("")
    public ResponseEntity<ReviewResponseDTO> createReview(
        @AuthenticationPrincipal BuyerEntity buyerEntity,
        @Valid @RequestPart("data") ReviewCreateRequestDTO reviewCreateRequestDTO,
        @RequestParam(value = "images", required = false)List<MultipartFile> images
    ) {
        return ResponseEntity.ok(reviewService.createReview(buyerEntity, reviewCreateRequestDTO, images));
    }

    /**
     * Retrieves a paginated list of reviews for a specific product.
     * <p>
     * This endpoint is publicly accessible (no authentication required).
     * </p>
     *
     * @param productId the numeric ID of the product whose reviews to retrieve
     * @param pageable pagination parameters (page, size, sort)
     * @return {@link ResponseEntity} with HTTP 200 (OK) and a {@link Slice} of review responses
     */
    @GetMapping("/product/{productId}")
    public ResponseEntity<Slice<ReviewResponseDTO>> getAllReviewsByProductId(
        @PathVariable Long productId,
        Pageable pageable
    ) {
        return ResponseEntity.ok(reviewService.getReviewByProductId(productId, pageable));
    }

    /**
     * Deletes a review owned by the authenticated buyer.
     *
     * @param buyerEntity the authenticated buyer extracted from the security context
     * @param reviewId the numeric ID of the review to delete
     * @return {@link ResponseEntity} with HTTP 204 (No Content) on success
     */
    @DeleteMapping("/{reviewId}")
    public ResponseEntity<Void> deleteReview(
        @AuthenticationPrincipal BuyerEntity buyerEntity,
        @PathVariable Long reviewId
    ) {
        reviewService.deleteReview(buyerEntity, reviewId);
        return ResponseEntity.noContent().build();
    }
}
