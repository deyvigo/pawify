package com.example.pawify.controller;

import com.example.pawify.dto.out.product.CategoryResponseDTO;
import com.example.pawify.service.CategoryService;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * REST controller for category retrieval operations.
 * <p>
 * Provides endpoints for listing all available product categories.
 * </p>
 */
@RestController
@RequestMapping("/category")
@AllArgsConstructor
public class CategoryController {
    private CategoryService categoryService;

    /**
     * Retrieves all categories ordered alphabetically by name in ascending order.
     * <p>
     * This endpoint is publicly accessible (no authentication required).
     * </p>
     *
     * @return {@link ResponseEntity} with HTTP 200 (OK) and the list of category responses
     */
    @GetMapping("")
    public ResponseEntity<List<CategoryResponseDTO>> findAllOrderedByName() {
        return ResponseEntity.ok(categoryService.findAllOrderedByNameAsc());
    }
}
