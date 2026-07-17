package com.example.pawify.service;

import com.example.pawify.dto.out.product.BrandResponseDTO;

import java.util.List;

// Servicio de consulta de marcas de productos
public interface BrandService {

    // Retorna todas las marcas ordenadas alfabeticamente
    List<BrandResponseDTO> findAllOrderedByNameAsc();
}
