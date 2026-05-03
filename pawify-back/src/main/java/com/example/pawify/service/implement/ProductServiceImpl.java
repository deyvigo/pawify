package com.example.pawify.service.implement;

import com.example.pawify.dto.in.product.ProductCreateRequestDTO;
import com.example.pawify.dto.out.product.ProductResponseSimpleDTO;
import com.example.pawify.exception.ImagesNotProvidedException;
import com.example.pawify.exception.ResourceNotFoundException;
import com.example.pawify.exception.UnauthorizedRequestException;
import com.example.pawify.mapper.ProductMapper;
import com.example.pawify.model.*;
import com.example.pawify.repository.*;
import com.example.pawify.service.CloudinaryService;
import com.example.pawify.service.CodeGenerator;
import com.example.pawify.service.ProductService;
import com.example.pawify.specifications.ProductSpecification;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.data.domain.SliceImpl;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Service
@AllArgsConstructor
public class ProductServiceImpl implements ProductService {
    private final ImageRepository imageRepository;
    private final ProductRepository productRepository;
    private final CloudinaryService cloudinaryService;
    private final ProductMapper productMapper;
    private final CodeGenerator codeGenerator;
    private final BrandRepository brandRepository;
    private final CategoryRepository categoryRepository;
    private final SubCategoryRepository subCategoryRepository;

    @Override
    @Transactional
    public ProductResponseSimpleDTO createProduct(
        ProductCreateRequestDTO productCreateRequestDTO, List<MultipartFile> images, UserEntity userEntity
    ) {
        if (!userEntity.getRole().getRole().equals(RoleEnum.ADMIN)) {
            throw new UnauthorizedRequestException("Only admin can create products");
        }

        if (images == null || images.isEmpty()) throw new ImagesNotProvidedException("images list cannot be null or empty");

        AdminEntity adminEntity = (AdminEntity) userEntity;

        ProductEntity productEntity = productMapper.toEntity(productCreateRequestDTO);
        productEntity.setCreatedBy(adminEntity);

        String code;
        do {
            code = codeGenerator.generateCode();
        } while (productRepository.existsByShareCode(code));
        productEntity.setShareCode(code);

        // create or find brand
        BrandEntity brandEntity = brandRepository.findByName(productCreateRequestDTO.brand().toLowerCase())
            .orElse(null);

        if (brandEntity == null) {
            BrandEntity brand = new BrandEntity();
            brand.setName(productCreateRequestDTO.brand().toLowerCase());
            brandEntity = brandRepository.save(brand);
        }

        productEntity.setBrand(brandEntity);

        //create or find category
        CategoryEntity categoryEntity = categoryRepository.findByName(productCreateRequestDTO.category().toLowerCase())
            .orElse(null);

        if (categoryEntity == null) {
            CategoryEntity category = new CategoryEntity();
            category.setName(productCreateRequestDTO.category().toLowerCase());
            categoryEntity = categoryRepository.save(category);
        }

        productEntity.setCategory(categoryEntity);

        // create or find subcategory
        SubCategoryEntity subCategoryEntity = subCategoryRepository.findByName(productCreateRequestDTO.subCategory().toLowerCase())
            .orElse(null);

        if (subCategoryEntity == null) {
            SubCategoryEntity subCategory = new SubCategoryEntity();
            subCategory.setName(productCreateRequestDTO.subCategory().toLowerCase());
            subCategory.setCategory(categoryEntity);
            subCategoryEntity = subCategoryRepository.save(subCategory);
        }

        productEntity.setSubCategory(subCategoryEntity);

        ProductEntity savedProduct = productRepository.save(productEntity);

        List<ProductImageEntity> imageEntities = new ArrayList<>();

        for (MultipartFile image : images) {
            String url = cloudinaryService.uploadImage(image);

            ProductImageEntity imageEntity = new ProductImageEntity();
            imageEntity.setUrl(url);
            imageEntity.setProduct(savedProduct);

            imageEntities.add(imageRepository.save(imageEntity));
        }

        savedProduct.setImages(imageEntities);

        return productMapper.toResponseDTO(savedProduct);
    }

    @Override
    public Slice<ProductResponseSimpleDTO> getProducts(
        String search,
        String brand,
        String category,
        String subCategory,
        BigDecimal minPrice,
        BigDecimal maxPrice,
        Pageable pageable
    ) {
        Specification<ProductEntity> specs = Specification.unrestricted();

        if (search != null) {
            specs = specs.and(ProductSpecification.nameContains(search));
        }
        if (brand != null) {
            specs = specs.and(ProductSpecification.hasBrand(brand));
        }
        if (category != null) {
            specs = specs.and(ProductSpecification.hasCategory(category));
        }
        if (subCategory != null) {
            specs = specs.and(ProductSpecification.hasSubCategory(subCategory));
        }
        if (minPrice != null || maxPrice != null) {
            specs = specs.and(ProductSpecification.priceBetween(minPrice, maxPrice));
        }

        specs = specs.and(ProductSpecification.isActive());

        Page<ProductEntity> page = productRepository.findAll(specs, pageable);
        return new SliceImpl<>(
            page.map(productMapper::toResponseDTO).getContent(),
            pageable,
            page.hasNext()
        );
    }

    @Override
    public void deactivateProduct(String shareCode) {
        ProductEntity productEntity = productRepository.findByShareCode(shareCode)
            .orElseThrow(() -> new ResourceNotFoundException("Product with share code " + shareCode + " not found"));

        if (!productEntity.isActive()) return;

        productEntity.setActive(false);
        productRepository.save(productEntity);
    }

    @Override
    public void activateProduct(String shareCode) {
        ProductEntity productEntity = productRepository.findByShareCode(shareCode)
            .orElseThrow(() -> new ResourceNotFoundException("Product with share code " + shareCode + " not found"));

        if (!productEntity.isActive()) return;

        productEntity.setActive(true);
        productRepository.save(productEntity);
    }

    @Override
    public ProductResponseSimpleDTO getProductById(Long id) {
        return productMapper.toResponseDTO(productRepository.findById(id).orElse(null));
    }
}
