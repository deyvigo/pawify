package com.example.pawify.controller;

import com.example.pawify.dto.out.product.CategoryResponseDTO;
import com.example.pawify.dto.out.product.SubCategoryResponseDTO;
import com.example.pawify.service.CategoryService;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

// Controlador de categorias de productos
@RestController
@RequestMapping("/category")
@AllArgsConstructor
public class CategoryController {
    private CategoryService categoryService;

    // Lista todas las categorias ordenadas alfabeticamente
    @GetMapping("")
    public ResponseEntity<List<CategoryResponseDTO>> findAllOrderedByName() {
        return ResponseEntity.ok(categoryService.findAllOrderedByNameAsc());
    }

    @GetMapping("/{categoryName}/sub-category")
    public ResponseEntity<List<SubCategoryResponseDTO>> findAllByCategoryName(
        @PathVariable String categoryName
    ) {
        return ResponseEntity.ok(categoryService.findAllSubCategoriesByCategoryNameAsc(categoryName));
    }
}
