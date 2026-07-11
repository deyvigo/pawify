package com.example.pawify.service;

import com.example.pawify.dto.in.review.ReviewCreateRequestDTO;
import com.example.pawify.dto.out.review.ReviewResponseDTO;
import com.example.pawify.model.BuyerEntity;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

/**
 * Service interface for managing product reviews.
 *
 * <p>Provides operations for creating reviews with optional images,
 * retrieving paginated reviews for a product, and deleting reviews.
 * Reviews are associated with specific order details and can only be
 * created or deleted by the buyer who placed the order.</p>
 */
public interface ReviewService {

    /**
     * Creates a new review for a purchased product.
     *
     * <p>Validates that the buyer owns the referenced order detail and that
     * no review already exists for that detail. Optionally uploads review
     * images to Cloudinary. This operation is transactional.</p>
     *
     * @param buyerEntity the buyer creating the review
     * @param reviewCreateRequestDTO the data transfer object containing review content, rating, and detail ID
     * @param images optional list of review images to upload
     * @return the response DTO with the created review information
     * @throws com.example.pawify.exception.ResourceNotFoundException if the referenced order detail is not found
     * @throws com.example.pawify.exception.UnauthorizedRequestException if the buyer does not own the order detail
     * @throws com.example.pawify.exception.BadRequestException if a review already exists for the given order detail
     */
    ReviewResponseDTO createReview(
        BuyerEntity buyerEntity,
        ReviewCreateRequestDTO reviewCreateRequestDTO,
        List<MultipartFile> images
    );

    /**
     * Retrieves a paginated slice of reviews for the specified product.
     *
     * @param productId the unique identifier of the product
     * @param pageable the pagination and sorting parameters
     * @return a {@link Slice} of review response DTOs
     */
    Slice<ReviewResponseDTO> getReviewByProductId(
        Long productId,
        Pageable pageable
    );

    /**
     * Deletes a review by its identifier.
     *
     * <p>Validates that the buyer making the request is the owner of the review
     * before performing the deletion.</p>
     *
     * @param entity the authenticated buyer entity
     * @param reviewId the unique identifier of the review to delete
     * @throws com.example.pawify.exception.ResourceNotFoundException if the review is not found
     * @throws com.example.pawify.exception.UnauthorizedRequestException if the buyer is not the owner of the review
     */
    void deleteReview(BuyerEntity entity, Long reviewId);
}
