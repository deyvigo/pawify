package com.example.pawify.integration;

import com.example.pawify.dto.in.product.ProductCreateRequestDTO;
import com.example.pawify.model.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockMultipartFile;

import java.math.BigDecimal;

import static org.hamcrest.Matchers.greaterThanOrEqualTo;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

class ProductIntegrationTest extends BaseIntegrationTest {

    private BuyerEntity buyer;
    private String buyerToken;
    private AdminEntity admin;
    private String adminToken;
    private BrandEntity brand;
    private CategoryEntity category;
    private SubCategoryEntity subCategory;
    private ProductEntity product;

    @BeforeEach
    void setUp() {
        buyer = createAndSaveBuyer(
            "prodbuyer", "password123", "Prod", "Buyer",
            "prod@test.com", "55555555"
        );
        buyerToken = generateToken("prodbuyer", RoleEnum.BUYER);

        admin = createAndSaveAdmin(
            "prodadmin", "adminpass123", "Prod", "Admin", "66666666"
        );
        adminToken = generateToken("prodadmin", RoleEnum.ADMIN);

        brand = createAndSaveBrand("Pedigree");
        category = createAndSaveCategory("Alimentos");
        subCategory = createAndSaveSubCategory("Comida Seca", category);

        product = createAndSaveProduct(
            "Dog Chow Adulto", BigDecimal.valueOf(25.50), 100,
            admin, brand, category, subCategory
        );
    }

    @Nested
    @DisplayName("CP-027 | Listar productos activos")
    class CP027 {

        @Test
        @DisplayName("debe listar productos activos con 200 OK")
        void listActiveProducts() throws Exception {
            mockMvc.perform(get("/product?page=0&size=10&sort=name&order=asc")
                    .header("Authorization", "Bearer " + buyerToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content").isArray())
                .andExpect(jsonPath("$.content.length()").value(greaterThanOrEqualTo(1)));
        }
    }

    @Nested
    @DisplayName("CP-028 | Filtrar por nombre")
    class CP028 {

        @Test
        @DisplayName("debe filtrar productos por nombre con 200 OK")
        void filterBySearch() throws Exception {
            mockMvc.perform(get("/product?search=Dog")
                    .header("Authorization", "Bearer " + buyerToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content").isArray())
                .andExpect(jsonPath("$.content.length()").value(greaterThanOrEqualTo(1)));
        }
    }

    @Nested
    @DisplayName("CP-029 | Filtrar por categoria")
    class CP029 {

        @Test
        @DisplayName("debe filtrar productos por categoria con 200 OK")
        void filterByCategory() throws Exception {
            mockMvc.perform(get("/product?category=Alimentos")
                    .header("Authorization", "Bearer " + buyerToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content").isArray());
        }
    }

    @Nested
    @DisplayName("CP-030 | Filtrar por marca")
    class CP030 {

        @Test
        @DisplayName("debe filtrar productos por marca con 200 OK")
        void filterByBrand() throws Exception {
            mockMvc.perform(get("/product?brand=Pedigree")
                    .header("Authorization", "Bearer " + buyerToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content").isArray());
        }
    }

    @Nested
    @DisplayName("CP-031 | Filtrar por rango de precios")
    class CP031 {

        @Test
        @DisplayName("debe filtrar productos por rango de precios con 200 OK")
        void filterByPriceRange() throws Exception {
            mockMvc.perform(get("/product?minPrice=10&maxPrice=50")
                    .header("Authorization", "Bearer " + buyerToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content").isArray());
        }
    }

    @Nested
    @DisplayName("CP-032 | Obtener producto por ID")
    class CP032 {

        @Test
        @DisplayName("debe retornar el producto por ID con 200 OK")
        void getProductById() throws Exception {
            mockMvc.perform(get("/product/" + product.getId())
                    .header("Authorization", "Bearer " + buyerToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Dog Chow Adulto"));
        }
    }

    @Nested
    @DisplayName("CP-033 | Producto no encontrado")
    class CP033 {

        @Test
        @DisplayName("debe retornar 200 con body null cuando el producto no existe")
        void getProductNotFound() throws Exception {
            mockMvc.perform(get("/product/9999")
                    .header("Authorization", "Bearer " + buyerToken))
                .andExpect(status().isOk());
        }
    }

    @Nested
    @DisplayName("CP-034 | Admin crea producto")
    class CP034 {

        @Test
        @DisplayName("debe permitir al admin crear un producto con 200 OK")
        void adminCreateProduct() throws Exception {
            MockMultipartFile dataPart = new MockMultipartFile(
                "data", "", "application/json",
                asJson(new ProductCreateRequestDTO(
                    "Nuevo", "Descripcion test", "Pedigree", "Alimentos",
                    "Comida Seca", BigDecimal.valueOf(25.50), 50
                )).getBytes()
            );

            MockMultipartFile imagePart = new MockMultipartFile(
                "images", "test.jpg", "image/jpeg", "fake-image-data".getBytes()
            );

            mockMvc.perform(multipart("/product")
                    .file(dataPart)
                    .file(imagePart)
                    .header("Authorization", "Bearer " + adminToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Nuevo"));
        }
    }

    @Nested
    @DisplayName("CP-035 | Buyer no puede crear producto")
    class CP035 {

        @Test
        @DisplayName("debe retornar 403 FORBIDDEN al buyer intentar crear producto")
        void buyerCannotCreateProduct() throws Exception {
            MockMultipartFile dataPart = new MockMultipartFile(
                "data", "", "application/json",
                asJson(new ProductCreateRequestDTO(
                    "Nuevo", "Descripcion test", "Pedigree", "Alimentos",
                    "Comida Seca", BigDecimal.valueOf(25.50), 50
                )).getBytes()
            );

            MockMultipartFile imagePart = new MockMultipartFile(
                "images", "test.jpg", "image/jpeg", "fake-image-data".getBytes()
            );

            mockMvc.perform(multipart("/product")
                    .file(dataPart)
                    .file(imagePart)
                    .header("Authorization", "Bearer " + buyerToken))
                .andExpect(status().isForbidden());
        }
    }

    @Nested
    @DisplayName("CP-036 | Rechazar creacion con campos vacios")
    class CP036 {

        @Test
        @DisplayName("debe retornar 400 BAD_REQUEST con campos vacios")
        void rejectEmptyFields() throws Exception {
            String emptyBody = """
                {
                    "name": "",
                    "brand": "",
                    "category": "",
                    "sub_category": "",
                    "price": null,
                    "stock": -1
                }
                """;

            MockMultipartFile dataPart = new MockMultipartFile(
                "data", "", "application/json", emptyBody.getBytes()
            );

            MockMultipartFile imagePart = new MockMultipartFile(
                "images", "test.jpg", "image/jpeg", "fake-image-data".getBytes()
            );

            mockMvc.perform(multipart("/product")
                    .file(dataPart)
                    .file(imagePart)
                    .header("Authorization", "Bearer " + adminToken))
                .andExpect(status().isBadRequest());
        }
    }

    @Nested
    @DisplayName("CP-037 | Admin desactiva producto")
    class CP037 {

        @Test
        @DisplayName("debe permitir al admin desactivar un producto con 204 NO_CONTENT")
        void adminDeactivateProduct() throws Exception {
            mockMvc.perform(patch("/product/" + product.getShareCode() + "/deactivate")
                    .header("Authorization", "Bearer " + adminToken))
                .andExpect(status().isNoContent());
        }
    }

    @Nested
    @DisplayName("CP-038 | Admin activa producto")
    class CP038 {

        @Test
        @DisplayName("debe permitir al admin activar un producto inactivo con 204 NO_CONTENT")
        void adminActivateProduct() throws Exception {
            product.setActive(false);
            productRepository.save(product);

            mockMvc.perform(patch("/product/" + product.getShareCode() + "/activate")
                    .header("Authorization", "Bearer " + adminToken))
                .andExpect(status().isNoContent());
        }
    }

    @Nested
    @DisplayName("CP-039 | Buyer no puede desactivar")
    class CP039 {

        @Test
        @DisplayName("debe retornar 403 FORBIDDEN al buyer intentar desactivar producto")
        void buyerCannotDeactivateProduct() throws Exception {
            mockMvc.perform(patch("/product/" + product.getShareCode() + "/deactivate")
                    .header("Authorization", "Bearer " + buyerToken))
                .andExpect(status().isForbidden());
        }
    }

    @Nested
    @DisplayName("CP-040 | Listar categorias")
    class CP040 {

        @Test
        @DisplayName("debe listar las categorias con 200 OK")
        void listCategories() throws Exception {
            mockMvc.perform(get("/category")
                    .header("Authorization", "Bearer " + buyerToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$.length()").value(greaterThanOrEqualTo(1)));
        }
    }

    @Nested
    @DisplayName("CP-042 | Listar marcas")
    class CP042 {

        @Test
        @DisplayName("debe listar las marcas con 200 OK")
        void listBrands() throws Exception {
            mockMvc.perform(get("/brand")
                    .header("Authorization", "Bearer " + buyerToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$.length()").value(greaterThanOrEqualTo(1)));
        }
    }
}
