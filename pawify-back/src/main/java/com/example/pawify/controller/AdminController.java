package com.example.pawify.controller;

import com.example.pawify.dto.in.admin.ChangeOrderStatusShipmentRequestDTO;
import com.example.pawify.dto.out.admin.AdminResponseSimpleDTO;
import com.example.pawify.dto.out.admin.OrderSimpleResponseDTO;
import com.example.pawify.dto.out.buyer.BuyerResponseSimpleDTO;
import com.example.pawify.dto.out.product.ProductResponseSimpleDTO;
import com.example.pawify.model.AdminEntity;
import com.example.pawify.service.AdminService;
import com.example.pawify.service.ProductService;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;

@RestController
@RequestMapping("/admin")
@AllArgsConstructor
public class AdminController {
    private final AdminService adminService;
    private final ProductService productService;

    @GetMapping("/buyers")
    public ResponseEntity<Page<BuyerResponseSimpleDTO>> getAllBuyers(Pageable pageable) {
        return ResponseEntity.ok(adminService.getAllBuyers(pageable));
    }

    @GetMapping("/admins")
    public ResponseEntity<Page<AdminResponseSimpleDTO>> getAllAdmins(Pageable pageable) {
        return ResponseEntity.ok(adminService.getAllAdmins(pageable));
    }

    @PatchMapping("/order/{trackingCode}/shipping-status")
    public ResponseEntity<Void> changeOrderStatus(
        @Valid @RequestBody ChangeOrderStatusShipmentRequestDTO requestDTO,
        @PathVariable String trackingCode
    ) {
        adminService.changeOrderStatusByOrderId(requestDTO, trackingCode);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/order")
    public ResponseEntity<Page<OrderSimpleResponseDTO>> getAllOrders(
        Pageable pageable,
        @RequestParam(value = "trackingCode", required = false) String trackingCode
    ) {
        return ResponseEntity.ok(adminService.getAllOrders(pageable, trackingCode));
    }

    @GetMapping("/profile")
    public ResponseEntity<AdminResponseSimpleDTO> getAdminProfile(
        @AuthenticationPrincipal AdminEntity adminEntity
    ) {
        return ResponseEntity.ok(adminService.getAdmin(adminEntity));
    }

    @GetMapping("/product")
    public ResponseEntity<Page<ProductResponseSimpleDTO>> getProducts(
        @RequestParam(required = false) String search,
        @RequestParam(required = false) String brand,
        @RequestParam(required = false) String category,
        @RequestParam(required = false) String subCategory,
        @RequestParam(required = false) BigDecimal minPrice,
        @RequestParam(required = false) BigDecimal maxPrice,
        Pageable pageable
    ) {
        return ResponseEntity.ok(adminService.getProducts(
            search, brand, category, subCategory, minPrice, maxPrice, pageable
        ));
    }
}
