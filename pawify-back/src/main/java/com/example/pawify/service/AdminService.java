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

// Servicio de operaciones administrativas
public interface AdminService {

    // Lista todos los compradores con paginacion
    Page<BuyerResponseSimpleDTO> getAllBuyers(Pageable pageable);

    // Lista todos los administradores con paginacion
    Page<AdminResponseSimpleDTO> getAllAdmins(Pageable pageable);

    // Cambia el estado de envio de una orden validando la transicion
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
