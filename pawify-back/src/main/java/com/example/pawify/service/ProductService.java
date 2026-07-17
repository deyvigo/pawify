package com.example.pawify.service;

import com.example.pawify.dto.in.product.ProductCreateRequestDTO;
import com.example.pawify.dto.out.product.ProductResponseSimpleDTO;
import com.example.pawify.model.UserEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;
import java.util.List;

// Servicio de gestion del catalogo de productos
public interface ProductService {

    // Crea un producto subiendo imagenes a Cloudinary y generando share code
    ProductResponseSimpleDTO createProduct(
        ProductCreateRequestDTO productCreateRequestDTO, List<MultipartFile> images, UserEntity userEntity
    );

    // Busca productos activos con filtros opcionales y paginacion
    Page<ProductResponseSimpleDTO> getProducts(
        String search,
        String brand,
        String category,
        String subCategory,
        BigDecimal minPrice,
        BigDecimal maxPrice,
        Pageable pageable
    );

    // Desactiva un producto por su share code
    void deactivateProduct(String shareCode);

    // Activa un producto por su share code
    void activateProduct(String shareCode);

    // Obtiene un producto por su ID
    ProductResponseSimpleDTO getProductById(Long id);

    // Actualiza los datos de un producto existente
    ProductResponseSimpleDTO updateProduct(Long id, ProductCreateRequestDTO productCreateRequestDTO);
}
