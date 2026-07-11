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

/**
 * REST controller for buyer profile management operations.
 * <p>
 * Provides endpoints for retrieving buyer information, updating profile images,
 * and modifying buyer personal data.
 * </p>
 */
@RestController
@RequestMapping("/buyer")
@AllArgsConstructor
public class BuyerController {
    private BuyerService buyerService;

    /**
     * Retrieves the profile information of the authenticated buyer.
     *
     * @param buyerEntity the authenticated buyer extracted from the security context
     * @return {@link ResponseEntity} with HTTP 200 (OK) and the buyer's profile data
     */
    @GetMapping("")
    public ResponseEntity<BuyerResponseSimpleDTO> getBuyerInfo(
        @AuthenticationPrincipal BuyerEntity buyerEntity
    ) {
        return ResponseEntity.ok(buyerService.getBuyer(buyerEntity));
    }

    /**
     * Creates or updates the profile image of the authenticated buyer.
     *
     * @param buyerEntity the authenticated buyer extracted from the security context
     * @param image the image file to upload as the new profile picture
     * @return {@link ResponseEntity} with HTTP 200 (OK) and the updated image data
     */
    @PutMapping("/profile")
    public ResponseEntity<BuyerImageResponseDTO> updateProfile(
        @AuthenticationPrincipal BuyerEntity buyerEntity,
        @Valid @RequestParam("image")MultipartFile image
    ) {
        return ResponseEntity.ok(buyerService.createOrUpdateImage(buyerEntity, image));
    }

    /**
     * Updates personal data of the authenticated buyer (e.g., name, phone).
     *
     * @param buyer the authenticated buyer extracted from the security context
     * @param updateBuyer the validated update request containing the new personal data
     * @return {@link ResponseEntity} with HTTP 200 (OK) and the updated buyer data
     */
    @PatchMapping("")
    public ResponseEntity<UpdateBuyerResponseDTO> updateBuyer(
        @AuthenticationPrincipal BuyerEntity buyer,
        @Valid @RequestBody UpdateBuyerRequestDTO updateBuyer
    ) {
        return ResponseEntity.ok((buyerService.updateBuyer(buyer, updateBuyer)));
    }
}
