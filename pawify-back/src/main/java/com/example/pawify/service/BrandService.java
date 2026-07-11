package com.example.pawify.service;

import com.example.pawify.dto.out.product.BrandResponseDTO;

import java.util.List;

/**
 * Service interface for retrieving product brand information.
 *
 * <p>Provides read-only operations for fetching brand data used in
 * product filtering and display.</p>
 */
public interface BrandService {

    /**
     * Retrieves all brands sorted alphabetically by name in ascending order.
     *
     * @return an immutable list of brand response DTOs sorted by name
     */
    List<BrandResponseDTO> findAllOrderedByNameAsc();
}
