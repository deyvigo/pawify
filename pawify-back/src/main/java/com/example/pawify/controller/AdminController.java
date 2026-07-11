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

/**
 * REST controller for administrative operations.
 * <p>
 * Provides endpoints for retrieving paginated lists of buyers and admins,
 * and for managing order shipping status.
 * </p>
 */
@RestController
@RequestMapping("/admin")
@AllArgsConstructor
public class AdminController {
    private final AdminService adminService;
    private final AuthService authService;

    /**
     * Retrieves a paginated list of all registered buyers.
     *
     * @param pageable pagination parameters (page, size, sort)
     * @return {@link ResponseEntity} with HTTP 200 (OK) and a {@link Slice} of buyer summaries
     */
    @GetMapping("/buyers")
    public ResponseEntity<Slice<BuyerResponseSimpleDTO>> getAllBuyers(Pageable pageable) {
        return ResponseEntity.ok(adminService.getAllBuyers(pageable));
    }

    /**
     * Retrieves a paginated list of all registered admin users.
     *
     * @param pageable pagination parameters (page, size, sort)
     * @return {@link ResponseEntity} with HTTP 200 (OK) and a {@link Slice} of admin summaries
     */
    @GetMapping("/admins")
    public ResponseEntity<Slice<AdminResponseSimpleDTO>> getAllAdmins(Pageable pageable) {
        return ResponseEntity.ok(adminService.getAllAdmins(pageable));
    }

    /**
     * Updates the shipping status of an order identified by its tracking code.
     *
     * @param requestDTO the validated request containing the new shipment status
     * @param trackingCode the unique tracking code of the order to update
     * @return {@link ResponseEntity} with HTTP 204 (No Content) on success
     */
    @PatchMapping("/order/{trackingCode}/shipping-status")
    public ResponseEntity<Void> changeOrderStatus(
        @Valid @RequestBody ChangeOrderStatusShipmentRequestDTO requestDTO,
        @PathVariable String trackingCode
    ) {
        adminService.changeOrderStatusByOrderId(requestDTO, trackingCode);
        return ResponseEntity.noContent().build();
    }
}
