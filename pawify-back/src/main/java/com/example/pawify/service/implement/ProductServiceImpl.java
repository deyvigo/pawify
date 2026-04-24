package com.example.pawify.service.implement;

import com.example.pawify.dto.in.product.ProductCreateRequestDTO;
import com.example.pawify.dto.out.product.ProductResponseDTO;
import com.example.pawify.exception.ImagesNotProvidedException;
import com.example.pawify.exception.UnauthorizedRequestException;
import com.example.pawify.mapper.ProductMapper;
import com.example.pawify.model.*;
import com.example.pawify.repository.BrandRepository;
import com.example.pawify.repository.CategoryRepository;
import com.example.pawify.repository.ImageRepository;
import com.example.pawify.repository.ProductRepository;
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

    @Override
    @Transactional
    public ProductResponseDTO createProduct(
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

        ProductEntity savedProduct = productRepository.save(productEntity);

        List<ImageEntity> imageEntities = new ArrayList<>();

        for (MultipartFile image : images) {
            String url = cloudinaryService.uploadImage(image);

            ImageEntity imageEntity = new ImageEntity();
            imageEntity.setUrl(url);
            imageEntity.setProduct(savedProduct);

            imageEntities.add(imageRepository.save(imageEntity));
        }

        savedProduct.setImages(imageEntities);

        return productMapper.toResponseDTO(savedProduct);
    }

    @Override
    public Slice<ProductResponseDTO> getProducts(
        String search,
        String brand,
        String category,
        BigDecimal minPrice,
        BigDecimal maxPrice,
        Pageable pageable
    ) {
        Specification<ProductEntity> specs = Specification.unrestricted();

        if (search != null) {
            specs = specs.and(ProductSpecification.nameContains(search));
            System.out.println("search: " + search);
        }
        if (brand != null) {
            specs = specs.and(ProductSpecification.hasBrand(brand));
        }
        if (category != null) {
            specs = specs.and(ProductSpecification.hasCategory(category));
        }
        if (minPrice != null || maxPrice != null) {
            specs = specs.and(ProductSpecification.priceBetween(minPrice, maxPrice));
        }

        Page<ProductEntity> page = productRepository.findAll(specs, pageable);
        Slice<ProductResponseDTO> slice = new SliceImpl<>(
            page.map(productMapper::toResponseDTO).getContent(),
            pageable,
            page.hasNext()
        );

        return slice;
    }
}
