package com.example.pawify.service;

import com.example.pawify.dto.out.product.CategoryResponseDTO;

import java.util.List;

// Servicio de consulta de categorias de productos
public interface CategoryService {

    // Retorna todas las categorias ordenadas alfabeticamente
    List<CategoryResponseDTO> findAllOrderedByNameAsc();
}
