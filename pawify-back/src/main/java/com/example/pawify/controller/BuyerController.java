package com.example.pawify.controller;

import com.example.pawify.dto.in.buyer.UpdateBuyerRequestDTO;
import com.example.pawify.dto.out.buyer.BuyerImageResponseDTO;
import com.example.pawify.dto.out.buyer.BuyerResponseSimpleDTO;
import com.example.pawify.dto.out.buyer.UpdateBuyerResponseDTO;
import com.example.pawify.model.BuyerEntity;
import com.example.pawify.service.BuyerService;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/buyer")
@AllArgsConstructor
public class BuyerController {
    private BuyerService buyerService;

    @GetMapping("")
    public ResponseEntity<BuyerResponseSimpleDTO> getBuyerInfo(
        @AuthenticationPrincipal BuyerEntity buyerEntity
    ) {
        return ResponseEntity.ok(buyerService.getBuyer(buyerEntity));
    }

    @PutMapping("/profile")
    public ResponseEntity<BuyerImageResponseDTO> updateProfile(
        @AuthenticationPrincipal BuyerEntity buyerEntity,
        @Valid @RequestParam("image")MultipartFile image
    ) {
        return ResponseEntity.ok(buyerService.createOrUpdateImage(buyerEntity, image));
    }

    @PatchMapping("")
    public ResponseEntity<UpdateBuyerResponseDTO> updateBuyer(
        @AuthenticationPrincipal BuyerEntity buyer,
        @Valid @RequestBody UpdateBuyerRequestDTO updateBuyer
    ) {
        return ResponseEntity.ok((buyerService.updateBuyer(buyer, updateBuyer)));
    }
}
