package com.example.pawify.service;

import com.example.pawify.dto.in.admin.ChangeOrderStatusShipmentRequestDTO;
import com.example.pawify.dto.out.admin.AdminResponseSimpleDTO;
import com.example.pawify.dto.out.admin.OrderSimpleResponseDTO;
import com.example.pawify.dto.out.buyer.BuyerResponseSimpleDTO;
import com.example.pawify.dto.out.product.ProductResponseSimpleDTO;
import com.example.pawify.model.AdminEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;

import java.math.BigDecimal;

public interface AdminService {
    Slice<BuyerResponseSimpleDTO> getAllBuyers(Pageable pageable);
    Slice<AdminResponseSimpleDTO> getAllAdmins(Pageable pageable);
    void changeOrderStatusByOrderId(ChangeOrderStatusShipmentRequestDTO newShippingStatus, String trackingCode);
    Page<OrderSimpleResponseDTO> getAllOrders(Pageable pageable, String trackingCode);
    AdminResponseSimpleDTO getAdmin(AdminEntity adminEntity);
    Page<ProductResponseSimpleDTO> getProducts(
        String search,
        String brand,
        String category,
        String subCategory,
        BigDecimal minPrice,
        BigDecimal maxPrice,
        Pageable pageable
    );
}
