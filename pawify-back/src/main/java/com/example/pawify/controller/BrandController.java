package com.example.pawify.controller;

import com.example.pawify.dto.out.product.BrandResponseDTO;
import com.example.pawify.service.BrandService;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * REST controller for brand retrieval operations.
 * <p>
 * Provides endpoints for listing all available product brands.
 * </p>
 */
@RestController
@RequestMapping("/brand")
@AllArgsConstructor
public class BrandController {
    private final BrandService brandService;

    /**
     * Retrieves all brands ordered alphabetically by name in ascending order.
     * <p>
     * This endpoint is publicly accessible (no authentication required).
     * </p>
     *
     * @return {@link ResponseEntity} with HTTP 200 (OK) and the list of brand responses
     */
    @GetMapping("")
    public ResponseEntity<List<BrandResponseDTO>> findAll() {
        return ResponseEntity.ok(brandService.findAllOrderedByNameAsc());
    }
}
