package com.example.pawify.service;

import com.example.pawify.dto.out.product.CategoryResponseDTO;

import java.util.List;

/**
 * Service interface for retrieving product category information.
 *
 * <p>Provides read-only operations for fetching category data used in
 * product filtering and display.</p>
 */
public interface CategoryService {

    /**
     * Retrieves all categories sorted alphabetically by name in ascending order.
     *
     * @return an immutable list of category response DTOs sorted by name
     */
    List<CategoryResponseDTO> findAllOrderedByNameAsc();
}
