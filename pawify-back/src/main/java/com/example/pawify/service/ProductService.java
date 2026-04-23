package com.example.pawify.service;

import com.example.pawify.dto.in.product.ProductCreateRequestDTO;
import com.example.pawify.dto.out.product.ProductResponseDTO;
import com.example.pawify.model.UserEntity;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface ProductService {
    ProductResponseDTO createProduct(
        ProductCreateRequestDTO productCreateRequestDTO, List<MultipartFile> images, UserEntity userEntity
    );

    Slice<ProductResponseDTO> getProducts(Pageable pageable);
}
