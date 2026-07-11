package com.example.pawify.controller;

import com.example.pawify.dto.in.product.ProductCreateRequestDTO;
import com.example.pawify.dto.out.product.ProductResponseSimpleDTO;
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

/**
 * REST controller for product management operations.
 * <p>
 * Provides endpoints for creating, retrieving, updating, and managing
 * product lifecycle (activation/deactivation). Supports product search
 * with filtering by brand, category, sub-category, and price range.
 * </p>
 */
@RestController
@RequestMapping("/product")
@AllArgsConstructor
public class ProductController {
    private ProductService productService;

    /**
     * Creates a new product with one or more images.
     * <p>
     * Accepts a multipart request with product data as a JSON part and images as file parts.
     * </p>
     *
     * @param productCreateRequestDTO the validated product creation data
     * @param images the list of product images to upload
     * @param userEntity the authenticated admin user who creates the product
     * @return {@link ResponseEntity} with HTTP 200 (OK) and the created product data
     */
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping(value = "", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ProductResponseSimpleDTO> createProduct(
        @Valid @RequestPart("data") ProductCreateRequestDTO productCreateRequestDTO,
        @RequestParam("images") List<MultipartFile> images,
        @AuthenticationPrincipal UserEntity userEntity
        ) {
        return ResponseEntity.ok(productService.createProduct(productCreateRequestDTO, images, userEntity));
    }

    /**
     * Retrieves a paginated and filterable list of active products.
     *
     * @param search optional text search query to filter products by name or description
     * @param brand optional brand name filter
     * @param category optional category name filter
     * @param subCategory optional sub-category name filter
     * @param minPrice optional minimum price filter (inclusive)
     * @param maxPrice optional maximum price filter (inclusive)
     * @param pageable pagination parameters (page, size, sort)
     * @return {@link ResponseEntity} with HTTP 200 (OK) and a {@link Slice} of product responses
     */
    @GetMapping("")
    public ResponseEntity<Slice<ProductResponseSimpleDTO>> getProducts(
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

    /**
     * Deactivates a product by its share code, making it no longer visible in search results.
     *
     * @param shareCode the unique share code of the product to deactivate
     * @return {@link ResponseEntity} with HTTP 204 (No Content) on success
     */
    @PreAuthorize("hasRole('ADMIN')")
    @PatchMapping("/{shareCode}/deactivate")
    public ResponseEntity<Void> deactivateProduct(
        @PathVariable String shareCode
    ) {
        productService.deactivateProduct(shareCode);
        return ResponseEntity.noContent().build();
    }

    /**
     * Activates a previously deactivated product by its share code.
     *
     * @param shareCode the unique share code of the product to activate
     * @return {@link ResponseEntity} with HTTP 204 (No Content) on success
     */
    @PreAuthorize("hasRole('ADMIN')")
    @PatchMapping("/{shareCode}/activate")
    public ResponseEntity<Void> activateProduct(
        @PathVariable String shareCode
    ) {
        productService.activateProduct(shareCode);
        return ResponseEntity.noContent().build();
    }

    /**
     * Retrieves a single product by its numeric ID.
     * <p>
     * This endpoint is publicly accessible (no authentication required).
     * </p>
     *
     * @param id the numeric ID of the product
     * @return {@link ResponseEntity} with HTTP 200 (OK) and the product data
     */
    @GetMapping("/{id}")
    public ResponseEntity<ProductResponseSimpleDTO> getProductById(
        @PathVariable Long id
    ) {
        return ResponseEntity.ok(productService.getProductById(id));
    }

    /**
     * Updates an existing product's data (without replacing images).
     *
     * @param id the numeric ID of the product to update
     * @param productCreateRequestDTO the validated product update data
     * @return {@link ResponseEntity} with HTTP 200 (OK) and the updated product data
     */
    @PreAuthorize("hasRole('ADMIN')")
    @PatchMapping("/{id}")
    public ResponseEntity<ProductResponseSimpleDTO> updateProduct(
        @PathVariable Long id,
        @Valid @RequestBody ProductCreateRequestDTO productCreateRequestDTO
    ) {
        return ResponseEntity.ok(productService.updateProduct(id, productCreateRequestDTO));
    }
}
