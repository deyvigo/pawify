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

@RestController
@RequestMapping("/address")
@AllArgsConstructor
public class AddressController {
    private final AddressService addressService;

    @PostMapping("")
    public ResponseEntity<AddressResponseDTO> createAddress(
        @Valid @RequestBody AddressCreateRequestDTO addressCreateRequestDTO,
        @AuthenticationPrincipal BuyerEntity buyerEntity
    ) {
        return ResponseEntity.ok(addressService.createAddress(addressCreateRequestDTO, buyerEntity));
    }

    @GetMapping("")
    public ResponseEntity<List<AddressResponseDTO>> getAllAddress(
        @AuthenticationPrincipal BuyerEntity buyerEntity
    ) {
        return ResponseEntity.ok(addressService.getAddressesByBuyer(buyerEntity));
    }

    @PatchMapping("/{id}/deactivate")
    public ResponseEntity<Void> deactivateAddress(
        @PathVariable Long id,
        @AuthenticationPrincipal BuyerEntity buyerEntity
    ) {
        addressService.deactivateAddress(id, buyerEntity);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<AddressResponseDTO> updateAddress(
        @PathVariable Long id,
        @AuthenticationPrincipal BuyerEntity buyerEntity,
        @Valid @RequestBody AddressCreateRequestDTO requestDTO
    ) {
        return ResponseEntity.ok(addressService.updateAddressByBuyer(id, requestDTO, buyerEntity));
    }
}
