package com.example.pawify.service;

import com.example.pawify.dto.in.product.ProductCreateRequestDTO;
import com.example.pawify.dto.out.product.ProductResponseSimpleDTO;
import com.example.pawify.model.UserEntity;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;
import java.util.List;

/**
 * Service interface for managing products in the catalog.
 *
 * <p>Provides operations for creating, querying, updating, activating,
 * and deactivating products. Supports filtering by search term, brand,
 * category, subcategory, and price range. Only admin users are permitted
 * to create products.</p>
 */
public interface ProductService {

    /**
     * Creates a new product in the catalog.
     *
     * <p>Validates that the requesting user has the ADMIN role, uploads
     * images to Cloudinary, generates a unique share code, and creates
     * or reuses brand, category, and subcategory entities as needed.
     * This operation is transactional.</p>
     *
     * @param productCreateRequestDTO the data transfer object containing product details
     * @param images the list of product images to upload (must not be null or empty)
     * @param userEntity the authenticated user creating the product (must have ADMIN role)
     * @return the response DTO with the created product information
     * @throws com.example.pawify.exception.UnauthorizedRequestException if the user is not an admin
     * @throws com.example.pawify.exception.ImagesNotProvidedException if the images list is null or empty
     */
    ProductResponseSimpleDTO createProduct(
        ProductCreateRequestDTO productCreateRequestDTO, List<MultipartFile> images, UserEntity userEntity
    );

    /**
     * Retrieves a paginated and filtered slice of active products.
     *
     * <p>Supports optional filtering by search term (name contains),
     * brand, category, subcategory, and price range. All returned
     * products are active.</p>
     *
     * @param search optional search term to filter by product name
     * @param brand optional brand name to filter by
     * @param category optional category name to filter by
     * @param subCategory optional subcategory name to filter by
     * @param minPrice optional minimum price for filtering
     * @param maxPrice optional maximum price for filtering
     * @param pageable the pagination and sorting parameters
     * @return a {@link Slice} of product response DTOs matching the filters
     */
    Slice<ProductResponseSimpleDTO> getProducts(
        String search,
        String brand,
        String category,
        String subCategory,
        BigDecimal minPrice,
        BigDecimal maxPrice,
        Pageable pageable
    );

    /**
     * Deactivates a product by its share code.
     *
     * <p>If the product is already inactive, this method performs no action.</p>
     *
     * @param shareCode the unique share code of the product to deactivate
     * @throws com.example.pawify.exception.ResourceNotFoundException if no product matches the share code
     */
    void deactivateProduct(String shareCode);

    /**
     * Activates a product by its share code.
     *
     * <p>If the product is already active, this method performs no action.</p>
     *
     * @param shareCode the unique share code of the product to activate
     * @throws com.example.pawify.exception.ResourceNotFoundException if no product matches the share code
     */
    void activateProduct(String shareCode);

    /**
     * Retrieves a single product by its database identifier.
     *
     * @param id the unique identifier of the product
     * @return the response DTO with the product information, or null if not found
     */
    ProductResponseSimpleDTO getProductById(Long id);

    /**
     * Updates an existing product's details.
     *
     * <p>Replaces the product name, description, price, brand, category,
     * and subcategory. Creates new brand, category, or subcategory entities
     * if they do not already exist.</p>
     *
     * @param id the unique identifier of the product to update
     * @param productCreateRequestDTO the data transfer object containing the updated product details
     * @return the response DTO with the updated product information
     * @throws com.example.pawify.exception.ResourceNotFoundException if the product is not found
     */
    ProductResponseSimpleDTO updateProduct(Long id, ProductCreateRequestDTO productCreateRequestDTO);
}
