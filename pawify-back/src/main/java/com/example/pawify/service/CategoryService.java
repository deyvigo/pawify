package com.example.pawify.service;

import com.example.pawify.dto.out.product.CategoryResponseDTO;
import com.example.pawify.dto.out.product.SubCategoryResponseDTO;

import java.util.List;

public interface CategoryService {
    List<CategoryResponseDTO> findAllOrderedByNameAsc();
    List<SubCategoryResponseDTO> findAllSubCategoriesByCategoryNameAsc(String categoryName);
}
