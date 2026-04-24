package com.example.pawify.controller;

import com.example.pawify.dto.out.product.CategoryResponseDTO;
import com.example.pawify.service.CategoryService;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/category")
@AllArgsConstructor
public class CategoryController {
    private CategoryService categoryService;

    @GetMapping("")
    public ResponseEntity<List<CategoryResponseDTO>> findAllOrderedByName() {
        return ResponseEntity.ok(categoryService.findAllOrderedByNameAsc());
    }
}
