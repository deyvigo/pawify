package com.example.pawify.controller;

import com.example.pawify.dto.out.product.BrandResponseDTO;
import com.example.pawify.service.BrandService;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

// Controlador de marcas de productos
@RestController
@RequestMapping("/brand")
@AllArgsConstructor
public class BrandController {
    private final BrandService brandService;

    // Lista todas las marcas ordenadas alfabeticamente
    @GetMapping("")
    public ResponseEntity<List<BrandResponseDTO>> findAll() {
        return ResponseEntity.ok(brandService.findAllOrderedByNameAsc());
    }
}
