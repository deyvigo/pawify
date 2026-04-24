package com.example.pawify.service;

import com.example.pawify.dto.out.product.BrandResponseDTO;

import java.util.List;

public interface BrandService {
    List<BrandResponseDTO> findAllOrderedByNameAsc();
}
