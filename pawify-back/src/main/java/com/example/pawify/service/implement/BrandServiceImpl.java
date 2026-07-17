package com.example.pawify.service.implement;

import com.example.pawify.dto.out.product.BrandResponseDTO;
import com.example.pawify.mapper.BrandMapper;
import com.example.pawify.repository.BrandRepository;
import com.example.pawify.service.BrandService;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

// Implementacion del servicio de consulta de marcas
@Service
@AllArgsConstructor
public class BrandServiceImpl implements BrandService {
    private final BrandRepository brandRepository;
    private final BrandMapper brandMapper;

    // Retorna todas las marcas ordenadas alfabeticamente
    @Override
    public List<BrandResponseDTO> findAllOrderedByNameAsc() {
        return brandRepository.findByOrderByNameAsc().stream()
            .map(brandMapper::toDTO)
            .toList();
    }
}
