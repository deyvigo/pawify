package com.example.pawify.controller;

import com.example.pawify.dto.in.admin.ChangeOrderStatusShipmentRequestDTO;
import com.example.pawify.dto.out.admin.AdminResponseSimpleDTO;
import com.example.pawify.dto.out.buyer.BuyerResponseSimpleDTO;
import com.example.pawify.service.AdminService;
import com.example.pawify.service.AuthService;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/admin")
@AllArgsConstructor
public class AdminController {
    private final AdminService adminService;
    private final AuthService authService;

    @GetMapping("/buyers")
    public ResponseEntity<Slice<BuyerResponseSimpleDTO>> getAllBuyers(Pageable pageable) {
        return ResponseEntity.ok(adminService.getAllBuyers(pageable));
    }

    @GetMapping("/admins")
    public ResponseEntity<Slice<AdminResponseSimpleDTO>> getAllAdmins(Pageable pageable) {
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
}
