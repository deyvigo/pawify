package com.example.pawify.controller;

import com.example.pawify.dto.in.address.AddressCreateRequestDTO;
import com.example.pawify.dto.out.address.AddressResponseDTO;
import com.example.pawify.model.BuyerEntity;
import com.example.pawify.service.AddressService;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST controller for shipping address management operations.
 * <p>
 * Provides endpoints for creating, retrieving, updating, and deactivating
 * shipping addresses associated with the authenticated buyer.
 * </p>
 */
@RestController
@RequestMapping("/address")
@AllArgsConstructor
public class AddressController {
    private final AddressService addressService;

    /**
     * Creates a new shipping address for the authenticated buyer.
     *
     * @param addressCreateRequestDTO the validated address creation request containing street, city, zip, etc.
     * @param buyerEntity the authenticated buyer extracted from the security context
     * @return {@link ResponseEntity} with HTTP 200 (OK) and the created address data
     */
    @PostMapping("")
    public ResponseEntity<AddressResponseDTO> createAddress(
        @Valid @RequestBody AddressCreateRequestDTO addressCreateRequestDTO,
        @AuthenticationPrincipal BuyerEntity buyerEntity
    ) {
        return ResponseEntity.ok(addressService.createAddress(addressCreateRequestDTO, buyerEntity));
    }

    /**
     * Retrieves all active shipping addresses belonging to the authenticated buyer.
     *
     * @param buyerEntity the authenticated buyer extracted from the security context
     * @return {@link ResponseEntity} with HTTP 200 (OK) and the list of address responses
     */
    @GetMapping("")
    public ResponseEntity<List<AddressResponseDTO>> getAllAddress(
        @AuthenticationPrincipal BuyerEntity buyerEntity
    ) {
        return ResponseEntity.ok(addressService.getAddressesByBuyer(buyerEntity));
    }

    /**
     * Deactivates a shipping address owned by the authenticated buyer.
     *
     * @param id the numeric ID of the address to deactivate
     * @param buyerEntity the authenticated buyer extracted from the security context
     * @return {@link ResponseEntity} with HTTP 204 (No Content) on success
     */
    @PatchMapping("/{id}/deactivate")
    public ResponseEntity<Void> deactivateAddress(
        @PathVariable Long id,
        @AuthenticationPrincipal BuyerEntity buyerEntity
    ) {
        addressService.deactivateAddress(id, buyerEntity);
        return ResponseEntity.noContent().build();
    }

    /**
     * Updates an existing shipping address belonging to the authenticated buyer.
     *
     * @param id the numeric ID of the address to update
     * @param buyerEntity the authenticated buyer extracted from the security context
     * @param requestDTO the validated address update data
     * @return {@link ResponseEntity} with HTTP 200 (OK) and the updated address data
     */
    @PutMapping("/{id}")
    public ResponseEntity<AddressResponseDTO> updateAddress(
        @PathVariable Long id,
        @AuthenticationPrincipal BuyerEntity buyerEntity,
        @Valid @RequestBody AddressCreateRequestDTO requestDTO
    ) {
        return ResponseEntity.ok(addressService.updateAddressByBuyer(id, requestDTO, buyerEntity));
    }
}
