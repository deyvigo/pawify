package com.example.pawify.integration;

import com.example.pawify.dto.in.order.DetailCreateRequestDTO;
import com.example.pawify.dto.in.order.OrderCreateRequestDTO;
import com.example.pawify.model.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MvcResult;

import java.math.BigDecimal;
import java.util.List;

import static org.hamcrest.Matchers.greaterThanOrEqualTo;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

class OrderIntegrationTest extends BaseIntegrationTest {

    private BuyerEntity buyer;
    private String buyerToken;
    private AdminEntity admin;
    private ProductEntity product;

    @BeforeEach
    void setUp() {
        buyer = createAndSaveBuyer(
            "orderbuyer", "password123", "Order", "Buyer",
            "order@test.com", "33333333"
        );
        buyerToken = generateToken("orderbuyer", RoleEnum.BUYER);

        admin = createAndSaveAdmin(
            "orderadmin", "adminpass123", "Order", "Admin", "44444444"
        );

        BrandEntity brand = createAndSaveBrand("TestBrand");
        CategoryEntity category = createAndSaveCategory("TestCategory");
        SubCategoryEntity subCategory = createAndSaveSubCategory("TestSubCategory", category);

        product = createAndSaveProduct(
            "Dog Chow Adulto", BigDecimal.valueOf(25.50), 100,
            admin, brand, category, subCategory
        );
    }

    @Nested
    @DisplayName("CP-015 | Crear orden exitosamente")
    class CP015 {

        @Test
        @DisplayName("debe crear una orden con 201 CREATED y retornar tracking_code")
        void createOrderSuccessfully() throws Exception {
            OrderCreateRequestDTO dto = new OrderCreateRequestDTO(
                List.of(new DetailCreateRequestDTO(product.getId(), 2))
            );

            mockMvc.perform(post("/order")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(asJson(dto))
                    .header("Authorization", "Bearer " + buyerToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.tracking_code").isNotEmpty())
                .andExpect(jsonPath("$.details").isArray())
                .andExpect(jsonPath("$.details.length()").value(1))
                .andExpect(jsonPath("$.details[0].quantity").value(2));
        }
    }

    @Nested
    @DisplayName("CP-016 | Crear orden con multiples productos")
    class CP016 {

        @Test
        @DisplayName("debe crear orden con multiples productos diferentes 201 CREATED")
        void createOrderWithMultipleProducts() throws Exception {
            BrandEntity brand2 = createAndSaveBrand("Brand2");
            CategoryEntity category2 = createAndSaveCategory("Category2");
            SubCategoryEntity subCategory2 = createAndSaveSubCategory("SubCategory2", category2);

            ProductEntity product2 = createAndSaveProduct(
                "Pedigree Adult", BigDecimal.valueOf(18.00), 50,
                admin, brand2, category2, subCategory2
            );

            OrderCreateRequestDTO dto = new OrderCreateRequestDTO(
                List.of(
                    new DetailCreateRequestDTO(product.getId(), 1),
                    new DetailCreateRequestDTO(product2.getId(), 1)
                )
            );

            mockMvc.perform(post("/order")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(asJson(dto))
                    .header("Authorization", "Bearer " + buyerToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.tracking_code").isNotEmpty())
                .andExpect(jsonPath("$.details.length()").value(2));
        }
    }

    @Nested
    @DisplayName("CP-017 | Agrupar productos duplicados")
    class CP017 {

        @Test
        @DisplayName("debe agrupar el mismo producto y sumar cantidades")
        void groupDuplicateProducts() throws Exception {
            OrderCreateRequestDTO dto = new OrderCreateRequestDTO(
                List.of(
                    new DetailCreateRequestDTO(product.getId(), 2),
                    new DetailCreateRequestDTO(product.getId(), 3)
                )
            );

            mockMvc.perform(post("/order")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(asJson(dto))
                    .header("Authorization", "Bearer " + buyerToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.details.length()").value(1))
                .andExpect(jsonPath("$.details[0].quantity").value(5));
        }
    }

    @Nested
    @DisplayName("CP-018 | Rechazar producto inexistente")
    class CP018 {

        @Test
        @DisplayName("debe retornar 404 NOT_FOUND con producto inexistente")
        void rejectNonExistentProduct() throws Exception {
            OrderCreateRequestDTO dto = new OrderCreateRequestDTO(
                List.of(new DetailCreateRequestDTO(9999L, 1))
            );

            mockMvc.perform(post("/order")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(asJson(dto))
                    .header("Authorization", "Bearer " + buyerToken))
                .andExpect(status().isNotFound());
        }
    }

    @Nested
    @DisplayName("CP-019 | Rechazar stock insuficiente")
    class CP019 {

        @Test
        @DisplayName("debe retornar error con stock insuficiente")
        void rejectInsufficientStock() throws Exception {
            OrderCreateRequestDTO dto = new OrderCreateRequestDTO(
                List.of(new DetailCreateRequestDTO(product.getId(), 99999))
            );

            mockMvc.perform(post("/order")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(asJson(dto))
                    .header("Authorization", "Bearer " + buyerToken))
                .andExpect(status().isConflict());
        }
    }

    @Nested
    @DisplayName("CP-020 | Rechazar producto sin stock")
    class CP020 {

        @Test
        @DisplayName("debe retornar error con producto sin stock")
        void rejectProductWithZeroStock() throws Exception {
            BrandEntity brand2 = createAndSaveBrand("NoStockBrand");
            CategoryEntity category2 = createAndSaveCategory("NoStockCategory");
            SubCategoryEntity subCategory2 = createAndSaveSubCategory("NoStockSubCategory", category2);

            ProductEntity noStockProduct = createAndSaveProduct(
                "Sin Stock", BigDecimal.valueOf(10.00), 0,
                admin, brand2, category2, subCategory2
            );

            OrderCreateRequestDTO dto = new OrderCreateRequestDTO(
                List.of(new DetailCreateRequestDTO(noStockProduct.getId(), 1))
            );

            mockMvc.perform(post("/order")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(asJson(dto))
                    .header("Authorization", "Bearer " + buyerToken))
                .andExpect(status().isConflict());
        }
    }

    @Nested
    @DisplayName("CP-021 | Rechazar cantidad cero")
    class CP021 {

        @Test
        @DisplayName("debe retornar 400 BAD_REQUEST con cantidad cero")
        void rejectZeroQuantity() throws Exception {
            OrderCreateRequestDTO dto = new OrderCreateRequestDTO(
                List.of(new DetailCreateRequestDTO(product.getId(), 0))
            );

            mockMvc.perform(post("/order")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(asJson(dto))
                    .header("Authorization", "Bearer " + buyerToken))
                .andExpect(status().isBadRequest());
        }
    }

    @Nested
    @DisplayName("CP-022 | Admin no puede crear orden")
    class CP022 {

        @Test
        @DisplayName("debe retornar 403 FORBIDDEN al admin intentar crear orden")
        void adminCannotCreateOrder() throws Exception {
            String adminToken = generateToken("orderadmin", RoleEnum.ADMIN);

            OrderCreateRequestDTO dto = new OrderCreateRequestDTO(
                List.of(new DetailCreateRequestDTO(product.getId(), 1))
            );

            mockMvc.perform(post("/order")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(asJson(dto))
                    .header("Authorization", "Bearer " + adminToken))
                .andExpect(status().isForbidden());
        }
    }

    @Nested
    @DisplayName("CP-023 | Listar ordenes del comprador")
    class CP023 {

        @Test
        @DisplayName("debe listar las ordenes del comprador con 200 OK")
        void listBuyerOrders() throws Exception {
            OrderCreateRequestDTO createDto = new OrderCreateRequestDTO(
                List.of(new DetailCreateRequestDTO(product.getId(), 1))
            );
            mockMvc.perform(post("/order")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(asJson(createDto))
                    .header("Authorization", "Bearer " + buyerToken))
                .andExpect(status().isOk());

            mockMvc.perform(get("/order?limit=5")
                    .header("Authorization", "Bearer " + buyerToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content").isArray());
        }
    }

    @Nested
    @DisplayName("CP-024 | Filtrar ordenes por estado")
    class CP024 {

        @Test
        @DisplayName("debe filtrar ordenes por estado PENDING con 200 OK")
        void filterOrdersByStatus() throws Exception {
            OrderCreateRequestDTO createDto = new OrderCreateRequestDTO(
                List.of(new DetailCreateRequestDTO(product.getId(), 1))
            );
            mockMvc.perform(post("/order")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(asJson(createDto))
                    .header("Authorization", "Bearer " + buyerToken))
                .andExpect(status().isOk());

            mockMvc.perform(get("/order?statuses=PENDING&limit=5")
                    .header("Authorization", "Bearer " + buyerToken))
                .andExpect(status().isOk());
        }
    }

    @Nested
    @DisplayName("CP-025 | Obtener orden por tracking code")
    class CP025 {

        @Test
        @DisplayName("debe retornar la orden por tracking_code con 200 OK")
        void getOrderByTrackingCode() throws Exception {
            OrderCreateRequestDTO createDto = new OrderCreateRequestDTO(
                List.of(new DetailCreateRequestDTO(product.getId(), 1))
            );
            MvcResult result = mockMvc.perform(post("/order")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(asJson(createDto))
                    .header("Authorization", "Bearer " + buyerToken))
                .andExpect(status().isOk())
                .andReturn();

            String responseBody = result.getResponse().getContentAsString();
            String trackingCode = objectMapper.readTree(responseBody).get("tracking_code").asText();

            mockMvc.perform(get("/order/" + trackingCode)
                    .header("Authorization", "Bearer " + buyerToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.tracking_code").value(trackingCode));
        }
    }

    @Nested
    @DisplayName("CP-026 | Tracking code inexistente")
    class CP026 {

        @Test
        @DisplayName("debe retornar 404 NOT_FOUND con tracking code inexistente")
        void getNonExistentTrackingCode() throws Exception {
            mockMvc.perform(get("/order/NOEXISTE-12345")
                    .header("Authorization", "Bearer " + buyerToken))
                .andExpect(status().isNotFound());
        }
    }
}
