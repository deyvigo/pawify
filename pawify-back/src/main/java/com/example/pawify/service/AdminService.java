package com.example.pawify.service;

import com.example.pawify.dto.in.admin.ChangeOrderStatusShipmentRequestDTO;
import com.example.pawify.dto.out.admin.AdminResponseSimpleDTO;
import com.example.pawify.dto.out.buyer.BuyerResponseSimpleDTO;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;

// Servicio de operaciones administrativas
public interface AdminService {

    // Lista todos los compradores con paginacion
    Slice<BuyerResponseSimpleDTO> getAllBuyers(Pageable pageable);

    // Lista todos los administradores con paginacion
    Slice<AdminResponseSimpleDTO> getAllAdmins(Pageable pageable);

    // Cambia el estado de envio de una orden validando la transicion
    void changeOrderStatusByOrderId(ChangeOrderStatusShipmentRequestDTO newShippingStatus, String trackingCode);
}
