package com.example.pawify.service.implement;

import com.example.pawify.dto.in.review.ReviewCreateRequestDTO;
import com.example.pawify.dto.out.review.ReviewResponseDTO;
import com.example.pawify.exception.BadRequestException;
import com.example.pawify.exception.ResourceNotFoundException;
import com.example.pawify.exception.UnauthorizedRequestException;
import com.example.pawify.mapper.ReviewMapper;
import com.example.pawify.model.*;
import com.example.pawify.repository.DetailRepository;
import com.example.pawify.repository.ReviewRepository;
import com.example.pawify.service.CloudinaryService;
import com.example.pawify.service.ReviewService;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Service
@AllArgsConstructor
public class ReviewServiceImpl implements ReviewService {
    private final DetailRepository detailRepository;
    private final CloudinaryService cloudinaryService;
    private final ReviewRepository reviewRepository;
    private final ReviewMapper reviewMapper;

    @Override
    @Transactional
    public ReviewResponseDTO createReview(
        BuyerEntity buyerEntity,
        ReviewCreateRequestDTO reviewCreateRequestDTO,
        List<MultipartFile> images
    ) {
        DetailEntity detailEntity = detailRepository.findById(reviewCreateRequestDTO.detailId())
            .orElseThrow(() -> new ResourceNotFoundException("detail_id not found"));

        if (!detailEntity.getOrder().getBuyer().getId().equals(buyerEntity.getId())) {
            throw new UnauthorizedRequestException("you are not the owner of this detail order");
        }

        if (reviewRepository.existsByDetail_Id(detailEntity.getId())) {
            throw new BadRequestException("review already exists for this purchase");
        }

        ReviewEntity reviewEntity = new ReviewEntity();
        reviewEntity.setBuyer(buyerEntity);
        reviewEntity.setContent(reviewCreateRequestDTO.content());
        reviewEntity.setRating(reviewCreateRequestDTO.rating());
        reviewEntity.setDetail(detailEntity);
        reviewEntity.setProduct(detailEntity.getProduct());

        if (images != null && !images.isEmpty()) {
            for (MultipartFile m: images) {
                ReviewImageEntity imageEntity = new ReviewImageEntity();
                String url = cloudinaryService.uploadImage(m);
                imageEntity.setUrl(url);
                imageEntity.setReview(reviewEntity);

                reviewEntity.getImages().add(imageEntity);
            }
        }

        ReviewEntity savedReview = reviewRepository.save(reviewEntity);

        return reviewMapper.toResponseDTO(savedReview);
    }
}
