package com.example.pawify.service.implement;

import com.example.pawify.dto.out.product.CategoryResponseDTO;
import com.example.pawify.mapper.CategoryMapper;
import com.example.pawify.repository.CategoryRepository;
import com.example.pawify.service.CategoryService;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Implementation of {@link CategoryService} that retrieves category information.
 *
 * <p>This service provides read-only access to category data, returning
 * all categories sorted alphabetically.</p>
 */
@Service
@AllArgsConstructor
public class CategoryServiceImpl implements CategoryService {
    private final CategoryMapper categoryMapper;
    private final CategoryRepository categoryRepository;

    /**
     * {@inheritDoc}
     */
    @Override
    public List<CategoryResponseDTO> findAllOrderedByNameAsc() {
        return categoryRepository.findByOrderByNameAsc().stream()
            .map(categoryMapper::toDTO)
            .toList();
    }
}
