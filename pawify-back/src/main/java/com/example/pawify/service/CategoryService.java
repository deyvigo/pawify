package com.example.pawify.service;

import com.example.pawify.dto.out.product.CategoryResponseDTO;

import java.util.List;

public interface CategoryService {
    List<CategoryResponseDTO> findAllOrderedByNameAsc();
}
