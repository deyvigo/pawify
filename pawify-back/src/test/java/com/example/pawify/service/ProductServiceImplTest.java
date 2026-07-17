package com.example.pawify.service;

import com.example.pawify.dto.in.product.ProductCreateRequestDTO;
import com.example.pawify.dto.out.product.ProductResponseSimpleDTO;
import com.example.pawify.exception.ImagesNotProvidedException;
import com.example.pawify.exception.ResourceNotFoundException;
import com.example.pawify.exception.UnauthorizedRequestException;
import com.example.pawify.mapper.ProductMapper;
import com.example.pawify.model.*;
import com.example.pawify.repository.*;
import com.example.pawify.service.implement.ProductServiceImpl;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;

import org.springframework.data.jpa.domain.Specification;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ProductServiceImplTest {

    @Mock
    private ImageRepository imageRepository;

    @Mock
    private ProductRepository productRepository;

    @Mock
    private CloudinaryService cloudinaryService;

    @Mock
    private ProductMapper productMapper;

    @Mock
    private CodeGenerator codeGenerator;

    @Mock
    private BrandRepository brandRepository;

    @Mock
    private CategoryRepository categoryRepository;

    @Mock
    private SubCategoryRepository subCategoryRepository;

    @InjectMocks
    private ProductServiceImpl productService;

    private AdminEntity createAdmin() {
        AdminEntity admin = new AdminEntity();
        admin.setId(1L);
        admin.setUsername("admin1");
        admin.setRole(createAdminRole());
        return admin;
    }

    private BuyerEntity createBuyer() {
        BuyerEntity buyer = new BuyerEntity();
        buyer.setId(2L);
        buyer.setUsername("buyer1");
        buyer.setRole(createBuyerRole());
        return buyer;
    }

    private RoleEntity createAdminRole() {
        RoleEntity role = new RoleEntity();
        role.setId(1L);
        role.setRole(RoleEnum.ADMIN);
        return role;
    }

    private RoleEntity createBuyerRole() {
        RoleEntity role = new RoleEntity();
        role.setId(2L);
        role.setRole(RoleEnum.BUYER);
        return role;
    }

    private ProductCreateRequestDTO createValidProductDTO() {
        return new ProductCreateRequestDTO(
            "Product 1", "Description", "BrandX", "Category1", "SubCat1",
            BigDecimal.valueOf(99.99), 100
        );
    }

    @Nested
    @DisplayName("createProduct tests")
    class CreateProductTests {

        @Test
        @DisplayName("should throw UnauthorizedRequestException when user is not admin")
        void shouldThrowWhenNotAdmin() {
            BuyerEntity buyer = createBuyer();
            ProductCreateRequestDTO dto = createValidProductDTO();
            List<MultipartFile> images = List.of(mock(MultipartFile.class));

            assertThatThrownBy(() -> productService.createProduct(dto, images, buyer))
                .isInstanceOf(UnauthorizedRequestException.class)
                .hasMessage("Only admin can create products");
        }

        @Test
        @DisplayName("should throw ImagesNotProvidedException when images list is empty")
        void shouldThrowWhenNoImages() {
            AdminEntity admin = createAdmin();
            ProductCreateRequestDTO dto = createValidProductDTO();
            List<MultipartFile> emptyImages = List.of();

            assertThatThrownBy(() -> productService.createProduct(dto, emptyImages, admin))
                .isInstanceOf(ImagesNotProvidedException.class)
                .hasMessage("images list cannot be null or empty");
        }

        @Test
        @DisplayName("should create product with new brand when brand does not exist")
        void shouldCreateNewBrandIfNotExists() {
            AdminEntity admin = createAdmin();
            ProductCreateRequestDTO dto = createValidProductDTO();
            MultipartFile mockImage = mock(MultipartFile.class);
            List<MultipartFile> images = List.of(mockImage);

            BrandEntity newBrand = new BrandEntity();
            newBrand.setName("brandx");

            CategoryEntity category = new CategoryEntity();
            category.setName("category1");

            SubCategoryEntity subCategory = new SubCategoryEntity();
            subCategory.setName("subcat1");

            ProductEntity savedProduct = new ProductEntity();
            savedProduct.setId(1L);
            savedProduct.setName("Product 1");
            savedProduct.setShareCode("SHARE123");

            ProductResponseSimpleDTO expectedResponse = new ProductResponseSimpleDTO(
                1L, "Product 1", "Description", BigDecimal.valueOf(99.99),
                null, null, null, 0, 100, "SHARE123", true, 0, 0.0,
                LocalDateTime.now(), new ArrayList<>()
            );

            when(productRepository.existsByShareCode("SHARE123")).thenReturn(false);
            when(codeGenerator.generateCode()).thenReturn("SHARE123");
            when(brandRepository.findByNameIgnoreCase("brandx")).thenReturn(Optional.empty());
            when(brandRepository.save(any(BrandEntity.class))).thenReturn(newBrand);
            when(categoryRepository.findByNameIgnoreCase("category1")).thenReturn(Optional.empty());
            when(categoryRepository.save(any(CategoryEntity.class))).thenReturn(category);
            when(subCategoryRepository.findByNameIgnoreCaseAndCategory_Name("subcat1", "category1")).thenReturn(Optional.empty());
            when(subCategoryRepository.save(any(SubCategoryEntity.class))).thenReturn(subCategory);
            when(productMapper.toEntity(dto)).thenReturn(new ProductEntity());
            when(productRepository.save(any(ProductEntity.class))).thenReturn(savedProduct);
            when(cloudinaryService.uploadImage(any())).thenReturn("http://image.url");
            when(imageRepository.save(any(ProductImageEntity.class))).thenReturn(new ProductImageEntity());
            when(productMapper.toResponseDTO(savedProduct)).thenReturn(expectedResponse);

            ProductResponseSimpleDTO result = productService.createProduct(dto, images, admin);

            assertThat(result).isNotNull();
            assertThat(result.shareCode()).isEqualTo("SHARE123");
            verify(brandRepository).save(any(BrandEntity.class));
        }

        @Test
        @DisplayName("should use existing brand when brand already exists")
        void shouldUseExistingBrand() {
            AdminEntity admin = createAdmin();
            ProductCreateRequestDTO dto = createValidProductDTO();
            MultipartFile mockImage = mock(MultipartFile.class);
            List<MultipartFile> images = List.of(mockImage);

            BrandEntity existingBrand = new BrandEntity();
            existingBrand.setName("existingbrand");

            CategoryEntity category = new CategoryEntity();
            category.setName("category1");
            SubCategoryEntity subCategory = new SubCategoryEntity();
            subCategory.setName("subcat1");

            ProductEntity savedProduct = new ProductEntity();
            savedProduct.setId(1L);
            savedProduct.setBrand(existingBrand);

            ProductResponseSimpleDTO expectedResponse = new ProductResponseSimpleDTO(
                1L, "Product 1", "Description", BigDecimal.valueOf(99.99),
                null, null, null, 0, 100, "SHARE123", true, 0, 0.0,
                LocalDateTime.now(), new ArrayList<>()
            );

            when(productRepository.existsByShareCode("SHARE123")).thenReturn(false);
            when(codeGenerator.generateCode()).thenReturn("SHARE123");
            when(brandRepository.findByNameIgnoreCase("brandx")).thenReturn(Optional.of(existingBrand));
            when(categoryRepository.findByNameIgnoreCase("category1")).thenReturn(Optional.of(category));
            when(subCategoryRepository.findByNameIgnoreCaseAndCategory_Name("subcat1", "category1")).thenReturn(Optional.of(subCategory));
            when(productMapper.toEntity(dto)).thenReturn(new ProductEntity());
            when(productRepository.save(any(ProductEntity.class))).thenReturn(savedProduct);
            when(cloudinaryService.uploadImage(any())).thenReturn("http://image.url");
            when(imageRepository.save(any(ProductImageEntity.class))).thenReturn(new ProductImageEntity());
            when(productMapper.toResponseDTO(savedProduct)).thenReturn(expectedResponse);

            productService.createProduct(dto, images, admin);

            verify(brandRepository, never()).save(any(BrandEntity.class));
        }
    }

    @Nested
    @DisplayName("deactivateProduct tests")
    class DeactivateProductTests {

        @Test
        @DisplayName("should throw ResourceNotFoundException when product not found")
        void shouldThrowWhenProductNotFound() {
            when(productRepository.findByShareCode("INVALID")).thenReturn(Optional.empty());

            assertThatThrownBy(() -> productService.deactivateProduct("INVALID"))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessage("Product with share code INVALID not found");
        }

        @Test
        @DisplayName("should do nothing when product is already inactive")
        void shouldDoNothingWhenAlreadyInactive() {
            ProductEntity product = new ProductEntity();
            product.setShareCode("SHARE123");
            product.setActive(false);

            when(productRepository.findByShareCode("SHARE123")).thenReturn(Optional.of(product));

            productService.deactivateProduct("SHARE123");

            verify(productRepository, never()).save(any());
        }

        @Test
        @DisplayName("should deactivate product when product is active")
        void shouldDeactivateWhenActive() {
            ProductEntity product = new ProductEntity();
            product.setShareCode("SHARE123");
            product.setActive(true);

            when(productRepository.findByShareCode("SHARE123")).thenReturn(Optional.of(product));

            productService.deactivateProduct("SHARE123");

            assertThat(product.isActive()).isFalse();
            verify(productRepository).save(product);
        }
    }

    @Nested
    @DisplayName("getProducts tests")
    class GetProductsTests {

        @Test
        @DisplayName("should return products without filters")
        void shouldReturnProductsWithoutFilters() {
            Pageable pageable = PageRequest.of(0, 10);
            ProductEntity product = new ProductEntity();
            product.setId(1L);
            product.setShareCode("SHARE123");

            Page<ProductEntity> page = new PageImpl<>(List.of(product), pageable, 1);
            ProductResponseSimpleDTO responseDTO = new ProductResponseSimpleDTO(
                1L, "Product 1", "Description", BigDecimal.valueOf(99.99),
                null, null, null, 0, 100, "SHARE123", true, 0, 0.0,
                LocalDateTime.now(), new ArrayList<>()
            );

            when(productRepository.findAll(any(Specification.class), eq(pageable))).thenReturn(page);
            when(productMapper.toResponseDTO(product)).thenReturn(responseDTO);

            Page<ProductResponseSimpleDTO> result = productService.getProducts(
                null, null, null, null, null, null, pageable
            );

            assertThat(result.getContent()).hasSize(1);
        }

        @Test
        @DisplayName("should filter products by search term")
        void shouldFilterBySearchTerm() {
            Pageable pageable = PageRequest.of(0, 10);
            ProductEntity product = new ProductEntity();
            product.setId(1L);

            Page<ProductEntity> page = new PageImpl<>(List.of(product), pageable, 1);
            ProductResponseSimpleDTO responseDTO = new ProductResponseSimpleDTO(
                1L, "Test Product", "Description", BigDecimal.valueOf(99.99),
                null, null, null, 0, 100, "SHARE123", true, 0, 0.0,
                LocalDateTime.now(), new ArrayList<>()
            );

            when(productRepository.findAll(any(Specification.class), eq(pageable))).thenReturn(page);
            when(productMapper.toResponseDTO(product)).thenReturn(responseDTO);

            Page<ProductResponseSimpleDTO> result = productService.getProducts(
                "Test", null, null, null, null, null, pageable
            );

            assertThat(result.getContent()).hasSize(1);
        }
    }

    @Nested
    @DisplayName("updateProduct tests")
    class UpdateProductTests {

        @Test
        @DisplayName("should throw ResourceNotFoundException when product not found")
        void shouldThrowWhenProductNotFound() {
            ProductCreateRequestDTO dto = createValidProductDTO();
            when(productRepository.findById(999L)).thenReturn(Optional.empty());

            assertThatThrownBy(() -> productService.updateProduct(999L, dto))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessage("Product with id 999 not found");
        }

        @Test
        @DisplayName("should update product successfully")
        void shouldUpdateProductSuccessfully() {
            ProductCreateRequestDTO dto = createValidProductDTO();
            ProductEntity existingProduct = new ProductEntity();
            existingProduct.setId(1L);
            existingProduct.setName("Old Name");

            BrandEntity brand = new BrandEntity();
            brand.setName("BrandX");
            CategoryEntity category = new CategoryEntity();
            category.setName("Category1");
            SubCategoryEntity subCategory = new SubCategoryEntity();
            subCategory.setName("SubCat1");

            ProductResponseSimpleDTO expectedResponse = new ProductResponseSimpleDTO(
                1L, "Product 1", "Description", BigDecimal.valueOf(99.99),
                null, null, null, 0, 100, "SHARE123", true, 0, 0.0,
                LocalDateTime.now(), new ArrayList<>()
            );

            when(productRepository.findById(1L)).thenReturn(Optional.of(existingProduct));
            when(brandRepository.findByNameIgnoreCase("BrandX")).thenReturn(Optional.of(brand));
            when(categoryRepository.findByNameIgnoreCase("Category1")).thenReturn(Optional.of(category));
            when(subCategoryRepository.findByNameIgnoreCaseAndCategory_Name("SubCat1", "Category1")).thenReturn(Optional.of(subCategory));
            when(productRepository.save(any(ProductEntity.class))).thenReturn(existingProduct);
            when(productMapper.toResponseDTO(existingProduct)).thenReturn(expectedResponse);

            ProductResponseSimpleDTO result = productService.updateProduct(1L, dto);

            assertThat(result).isNotNull();
            verify(productRepository).save(existingProduct);
        }
    }
}
