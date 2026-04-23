package com.example.pawify.controller;

import com.example.pawify.dto.in.product.ProductCreateRequestDTO;
import com.example.pawify.dto.out.product.ProductResponseDTO;
import com.example.pawify.model.UserEntity;
import com.example.pawify.service.ProductService;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/product")
@AllArgsConstructor
public class ProductController {
    private ProductService productService;

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping(value = "", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ProductResponseDTO createProduct(
        @Valid @ModelAttribute ProductCreateRequestDTO productCreateRequestDTO,
        @RequestParam("images") List<MultipartFile> images,
        @AuthenticationPrincipal UserEntity userEntity
        ) {
        return productService.createProduct(productCreateRequestDTO, images, userEntity);
    }

    @GetMapping("")
    public ResponseEntity<Slice<ProductResponseDTO>> getProducts(Pageable pageable) {
        return ResponseEntity.ok(productService.getProducts(pageable));
    }
}
