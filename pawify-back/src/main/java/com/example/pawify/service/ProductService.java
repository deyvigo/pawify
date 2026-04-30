package com.example.pawify.service;

import com.example.pawify.dto.in.product.ChangeActiveStatusDTO;
import com.example.pawify.dto.in.product.ProductCreateRequestDTO;
import com.example.pawify.dto.out.product.ProductResponseDTO;
import com.example.pawify.model.AdminEntity;
import com.example.pawify.model.UserEntity;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;
import java.util.List;

public interface ProductService {
    ProductResponseDTO createProduct(
        ProductCreateRequestDTO productCreateRequestDTO, List<MultipartFile> images, UserEntity userEntity
    );

    Slice<ProductResponseDTO> getProducts(
        String search,
        String brand,
        String category,
        String subCategory,
        BigDecimal minPrice,
        BigDecimal maxPrice,
        Pageable pageable
    );

    void deactivateProduct(String shareCode);
    void activateProduct(String shareCode);
}
