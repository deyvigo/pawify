package com.example.pawify.integration;

import com.example.pawify.config.TestCloudinaryConfig;
import com.example.pawify.config.security.JwtService;
import com.example.pawify.model.*;
import com.example.pawify.repository.*;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.test.web.servlet.setup.SecurityMockMvcConfigurers;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.ResultActions;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.context.WebApplicationContext;

import java.math.BigDecimal;
import java.util.Map;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;

@SpringBootTest
@ActiveProfiles("test")
@Import(TestCloudinaryConfig.class)
@Transactional
public abstract class BaseIntegrationTest {

    @Autowired
    protected WebApplicationContext webApplicationContext;

    @Autowired
    protected ObjectMapper objectMapper;

    protected MockMvc mockMvc;

    @BeforeEach
    void initMockMvc() {
        this.mockMvc = MockMvcBuilders
            .webAppContextSetup(webApplicationContext)
            .apply(SecurityMockMvcConfigurers.springSecurity())
            .build();
    }

    @Autowired
    protected JwtService jwtService;

    @Autowired
    protected UserRepository userRepository;

    @Autowired
    protected BuyerRepository buyerRepository;

    @Autowired
    protected AdminRepository adminRepository;

    @Autowired
    protected RoleRepository roleRepository;

    @Autowired
    protected ProductRepository productRepository;

    @Autowired
    protected OrderRepository orderRepository;

    @Autowired
    protected DetailRepository detailRepository;

    @Autowired
    protected BrandRepository brandRepository;

    @Autowired
    protected CategoryRepository categoryRepository;

    @Autowired
    protected SubCategoryRepository subCategoryRepository;

    @Autowired
    protected ImageRepository imageRepository;

    @Autowired
    protected PasswordEncoder passwordEncoder;

    protected String generateToken(String username, RoleEnum role) {
        return jwtService.buildAccessToken(Map.of(
            "id", 1L,
            "username", username,
            "role", role,
            "first_name", "Test",
            "last_name", "User"
        ));
    }

    protected String generateRefreshToken(String username) {
        return jwtService.buildRefreshToken(username);
    }

    protected String asJson(Object obj) throws Exception {
        return objectMapper.writeValueAsString(obj);
    }

    protected ResultActions performGet(String url, String token) throws Exception {
        return mockMvc.perform(
            get(url).header("Authorization", "Bearer " + token)
        );
    }

    protected ResultActions performPost(String url, String token, Object body) throws Exception {
        return mockMvc.perform(
            post(url)
                .contentType(MediaType.APPLICATION_JSON)
                .content(asJson(body))
                .header("Authorization", "Bearer " + token)
        );
    }

    protected ResultActions performPostNoToken(String url, Object body) throws Exception {
        return mockMvc.perform(
            post(url)
                .contentType(MediaType.APPLICATION_JSON)
                .content(asJson(body))
        );
    }

    protected ResultActions performGetNoToken(String url) throws Exception {
        return mockMvc.perform(get(url));
    }

    protected ResultActions performPatch(String url, String token, Object body) throws Exception {
        return mockMvc.perform(
            patch(url)
                .contentType(MediaType.APPLICATION_JSON)
                .content(asJson(body))
                .header("Authorization", "Bearer " + token)
        );
    }

    protected ResultActions performPatchNoBody(String url, String token) throws Exception {
        return mockMvc.perform(
            patch(url)
                .header("Authorization", "Bearer " + token)
        );
    }

    protected BuyerEntity createAndSaveBuyer(
        String username, String password, String firstName,
        String lastName, String email, String dniNumber
    ) {
        RoleEntity buyerRole = roleRepository.findByRole(RoleEnum.BUYER).orElseGet(() -> {
            RoleEntity role = new RoleEntity();
            role.setRole(RoleEnum.BUYER);
            return roleRepository.save(role);
        });

        BuyerEntity buyer = new BuyerEntity();
        buyer.setUsername(username);
        buyer.setPassword(passwordEncoder.encode(password));
        buyer.setFirstName(firstName);
        buyer.setLastName(lastName);
        buyer.setEmail(email);
        buyer.setDniNumber(dniNumber);
        buyer.setRole(buyerRole);
        return buyerRepository.save(buyer);
    }

    protected AdminEntity createAndSaveAdmin(
        String username, String password, String firstName,
        String lastName, String dniNumber
    ) {
        RoleEntity adminRole = roleRepository.findByRole(RoleEnum.ADMIN).orElseGet(() -> {
            RoleEntity role = new RoleEntity();
            role.setRole(RoleEnum.ADMIN);
            return roleRepository.save(role);
        });

        AdminEntity admin = new AdminEntity();
        admin.setUsername(username);
        admin.setPassword(passwordEncoder.encode(password));
        admin.setFirstName(firstName);
        admin.setLastName(lastName);
        admin.setDniNumber(dniNumber);
        admin.setRole(adminRole);
        return adminRepository.save(admin);
    }

    protected BrandEntity createAndSaveBrand(String name) {
        BrandEntity brand = new BrandEntity();
        brand.setName(name);
        return brandRepository.save(brand);
    }

    protected CategoryEntity createAndSaveCategory(String name) {
        CategoryEntity category = new CategoryEntity();
        category.setName(name);
        return categoryRepository.save(category);
    }

    protected SubCategoryEntity createAndSaveSubCategory(String name, CategoryEntity category) {
        SubCategoryEntity subCategory = new SubCategoryEntity();
        subCategory.setName(name);
        subCategory.setCategory(category);
        return subCategoryRepository.save(subCategory);
    }

    protected ProductEntity createAndSaveProduct(
        String name, BigDecimal price, int stock, AdminEntity admin,
        BrandEntity brand, CategoryEntity category, SubCategoryEntity subCategory
    ) {
        ProductEntity product = new ProductEntity();
        product.setName(name);
        product.setPrice(price);
        product.setStock(stock);
        product.setCreatedBy(admin);
        product.setBrand(brand);
        product.setCategory(category);
        product.setSubCategory(subCategory);
        product.setShareCode("SHARE-" + System.nanoTime());
        product.setActive(true);
        product.setImages(new java.util.HashSet<>());
        return productRepository.save(product);
    }
}
