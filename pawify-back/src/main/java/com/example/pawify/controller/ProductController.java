package com.example.pawify.controller;

import com.example.pawify.dto.in.product.ProductCreateRequestDTO;
import com.example.pawify.dto.out.product.ProductResponseSimpleDTO;
import com.example.pawify.model.UserEntity;
import com.example.pawify.service.ProductService;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
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

// Controlador de gestion de productos
@RestController
@RequestMapping("/product")
@AllArgsConstructor
public class ProductController {
    private ProductService productService;

    // Crea un nuevo producto con imagenes
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping(value = "", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ProductResponseSimpleDTO> createProduct(
        @Valid @RequestPart("data") ProductCreateRequestDTO productCreateRequestDTO,
        @RequestParam("images") List<MultipartFile> images,
        @AuthenticationPrincipal UserEntity userEntity
    ) {
        return ResponseEntity.ok(productService.createProduct(productCreateRequestDTO, images, userEntity));
    }

    // Lista productos activos con filtros opcionales
    @GetMapping("")
    public ResponseEntity<Page<ProductResponseSimpleDTO>> getProducts(
        @RequestParam(required = false) String search,
        @RequestParam(required = false) String brand,
        @RequestParam(required = false) String category,
        @RequestParam(required = false) String subCategory,
        @RequestParam(required = false) BigDecimal minPrice,
        @RequestParam(required = false) BigDecimal maxPrice,
        Pageable pageable
    ) {
        return ResponseEntity.ok(productService.getProducts(
            search, brand, category, subCategory, minPrice, maxPrice, pageable
        ));
    }

    // Desactiva un producto por su share code
    @PreAuthorize("hasRole('ADMIN')")
    @PatchMapping("/{shareCode}/deactivate")
    public ResponseEntity<Void> deactivateProduct(
        @PathVariable String shareCode
    ) {
        productService.deactivateProduct(shareCode);
        return ResponseEntity.noContent().build();
    }

    // Activa un producto por su share code
    @PreAuthorize("hasRole('ADMIN')")
    @PatchMapping("/{shareCode}/activate")
    public ResponseEntity<Void> activateProduct(
        @PathVariable String shareCode
    ) {
        productService.activateProduct(shareCode);
        return ResponseEntity.noContent().build();
    }

    // Obtiene un producto por su ID
    @GetMapping("/{id}")
    public ResponseEntity<ProductResponseSimpleDTO> getProductById(
        @PathVariable Long id
    ) {
        return ResponseEntity.ok(productService.getProductById(id));
    }

    // Actualiza los datos de un producto existente
    @PreAuthorize("hasRole('ADMIN')")
    @PatchMapping("/{id}")
    public ResponseEntity<ProductResponseSimpleDTO> updateProduct(
        @PathVariable Long id,
        @Valid @RequestBody ProductCreateRequestDTO productCreateRequestDTO
    ) {
        return ResponseEntity.ok(productService.updateProduct(id, productCreateRequestDTO));
    }
}
