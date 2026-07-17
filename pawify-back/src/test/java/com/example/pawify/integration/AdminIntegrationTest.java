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

class AdminIntegrationTest extends BaseIntegrationTest {

    private BuyerEntity buyer;
    private String buyerToken;
    private AdminEntity admin;
    private String adminToken;
    private ProductEntity product;

    @BeforeEach
    void setUp() {
        buyer = createAndSaveBuyer(
            "adminbuyer", "password123", "Admin", "Buyer",
            "adminbuyer@test.com", "77777777"
        );
        buyerToken = generateToken("adminbuyer", RoleEnum.BUYER);

        admin = createAndSaveAdmin(
            "admintest", "adminpass123", "Admin", "Test", "88888888"
        );
        adminToken = generateToken("admintest", RoleEnum.ADMIN);

        BrandEntity brand = createAndSaveBrand("AdminBrand");
        CategoryEntity category = createAndSaveCategory("AdminCategory");
        SubCategoryEntity subCategory = createAndSaveSubCategory("AdminSubCategory", category);

        product = createAndSaveProduct(
            "Admin Product", BigDecimal.valueOf(30.00), 50,
            admin, brand, category, subCategory
        );
    }

    @Nested
    @DisplayName("CP-049 | Listar buyers paginados")
    class CP049 {

        @Test
        @DisplayName("debe listar buyers paginados con 200 OK y content no vacio")
        void listBuyersPaginated() throws Exception {
            mockMvc.perform(get("/admin/buyers?page=0&size=10")
                    .header("Authorization", "Bearer " + adminToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content").isArray())
                .andExpect(jsonPath("$.content.length()").value(greaterThanOrEqualTo(1)));
        }
    }

    @Nested
    @DisplayName("CP-050 | Buyer no puede listar buyers")
    class CP050 {

        @Test
        @DisplayName("debe retornar 403 FORBIDDEN al buyer intentar listar buyers")
        void buyerCannotListBuyers() throws Exception {
            mockMvc.perform(get("/admin/buyers")
                    .header("Authorization", "Bearer " + buyerToken))
                .andExpect(status().isForbidden());
        }
    }

    @Nested
    @DisplayName("CP-052 | Listar admins paginados")
    class CP052 {

        @Test
        @DisplayName("debe listar admins paginados con 200 OK")
        void listAdminsPaginated() throws Exception {
            mockMvc.perform(get("/admin/admins?page=0&size=10")
                    .header("Authorization", "Bearer " + adminToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content").isArray());
        }
    }

    @Nested
    @DisplayName("CP-054 | Cambiar estado envio a DELIVERED")
    class CP054 {

        @Test
        @DisplayName("debe permitir al admin cambiar shipping status a DELIVERED")
        void adminChangeShippingStatus() throws Exception {
            OrderCreateRequestDTO createDto = new OrderCreateRequestDTO(
                List.of(new DetailCreateRequestDTO(product.getId(), 1))
            );
            MvcResult result = mockMvc.perform(post("/order")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(asJson(createDto))
                    .header("Authorization", "Bearer " + buyerToken))
                .andExpect(status().isOk())
                .andReturn();

            String trackingCode = objectMapper.readTree(
                result.getResponse().getContentAsString()
            ).get("tracking_code").asText();

            String body = """
                {"shipping_status": "DELIVERED"}
                """;

            mockMvc.perform(patch("/admin/order/" + trackingCode + "/shipping-status")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(body)
                    .header("Authorization", "Bearer " + adminToken))
                .andExpect(status().isNoContent());
        }
    }

    @Nested
    @DisplayName("CP-055 | Buyer no puede cambiar shipping")
    class CP055 {

        @Test
        @DisplayName("debe retornar 403 FORBIDDEN al buyer intentar cambiar shipping status")
        void buyerCannotChangeShipping() throws Exception {
            String body = """
                {"shipping_status": "DELIVERED"}
                """;

            mockMvc.perform(patch("/admin/order/ANY-CODE/shipping-status")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(body)
                    .header("Authorization", "Bearer " + buyerToken))
                .andExpect(status().isForbidden());
        }
    }

    @Nested
    @DisplayName("CP-056 | Shipping de orden inexistente")
    class CP056 {

        @Test
        @DisplayName("debe retornar 404 NOT_FOUND con orden inexistente")
        void changeShippingNonExistentOrder() throws Exception {
            String body = """
                {"shipping_status": "DELIVERED"}
                """;

            mockMvc.perform(patch("/admin/order/NOEXISTE-12345/shipping-status")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(body)
                    .header("Authorization", "Bearer " + adminToken))
                .andExpect(status().isNotFound());
        }
    }
}
