package com.example.pawify.controller;

import com.example.pawify.dto.in.product.ChangeActiveStatusDTO;
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

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/product")
@AllArgsConstructor
public class ProductController {
    private ProductService productService;

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping(value = "", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ProductResponseDTO> createProduct(
        @Valid @RequestPart("data") ProductCreateRequestDTO productCreateRequestDTO,
        @RequestParam("images") List<MultipartFile> images,
        @AuthenticationPrincipal UserEntity userEntity
        ) {
        return ResponseEntity.ok(productService.createProduct(productCreateRequestDTO, images, userEntity));
    }

    @GetMapping("")
    public ResponseEntity<Slice<ProductResponseDTO>> getProducts(
        @RequestParam(required = false) String search,
        @RequestParam(required = false) String brand,
        @RequestParam(required = false) String category,
        @RequestParam(required = false) BigDecimal minPrice,
        @RequestParam(required = false) BigDecimal maxPrice,
        Pageable pageable
    ) {
        return ResponseEntity.ok(productService.getProducts(
            search, brand, category, minPrice, maxPrice, pageable
        ));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PatchMapping("{shareCode}/active")
    public ResponseEntity<ProductResponseDTO> changeActiveStatus(
        @PathVariable String shareCode,
        @Valid @RequestBody ChangeActiveStatusDTO active
    ) {
        return ResponseEntity.ok(productService.changeActiveStatus(shareCode, active));
    }
}
