package com.example.pawify.service.implement;

import com.example.pawify.dto.in.product.ProductCreateRequestDTO;
import com.example.pawify.dto.out.product.ProductResponseDTO;
import com.example.pawify.exception.ImagesNotProvidedException;
import com.example.pawify.exception.UnauthorizedRequestException;
import com.example.pawify.mapper.ProductMapper;
import com.example.pawify.model.*;
import com.example.pawify.repository.AdminRepository;
import com.example.pawify.repository.ImageRepository;
import com.example.pawify.repository.ProductRepository;
import com.example.pawify.service.CloudinaryService;
import com.example.pawify.service.ProductService;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.List;

@Service
@AllArgsConstructor
public class ProductServiceImpl implements ProductService {
    private final ImageRepository imageRepository;
    private final ProductRepository productRepository;
    private final CloudinaryService cloudinaryService;
    private final ProductMapper productMapper;
    private final AdminRepository adminRepository;

    @Override
    @Transactional
    public ProductResponseDTO createProduct(
        ProductCreateRequestDTO productCreateRequestDTO, List<MultipartFile> images, UserEntity userEntity
    ) {
        if (!userEntity.getRole().getRole().equals(RoleEnum.ADMIN)) {
            throw new UnauthorizedRequestException("Only admin can create products");
        }

        if (images == null || images.isEmpty()) throw new ImagesNotProvidedException("images list cannot be null or empty");

        AdminEntity adminEntity = (AdminEntity) userEntity;

        ProductEntity productEntity = productMapper.toEntity(productCreateRequestDTO);
        productEntity.setCreatedBy(adminEntity);
        ProductEntity savedProduct = productRepository.save(productEntity);

        List<ImageEntity> imageEntities = new ArrayList<>();

        for (MultipartFile image : images) {
            String url = cloudinaryService.uploadImage(image);

            ImageEntity imageEntity = new ImageEntity();
            imageEntity.setUrl(url);
            imageEntity.setProduct(savedProduct);

            imageEntities.add(imageRepository.save(imageEntity));
        }

        savedProduct.setImages(imageEntities);

        return productMapper.toResponseDTO(savedProduct);
    }
}
