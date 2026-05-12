package com.example.pawify.service;

import com.example.pawify.dto.in.review.ReviewCreateRequestDTO;
import com.example.pawify.dto.out.review.ReviewResponseDTO;
import com.example.pawify.model.BuyerEntity;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface ReviewService {
    ReviewResponseDTO createReview(
        BuyerEntity buyerEntity,
        ReviewCreateRequestDTO reviewCreateRequestDTO,
        List<MultipartFile> images
    );

    Slice<ReviewResponseDTO> getReviewByProductId(
        Long productId,
        Pageable pageable
    );

    void deleteReview(BuyerEntity entity, Long reviewId);
}
