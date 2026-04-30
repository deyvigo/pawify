package com.example.pawify.controller;

import com.example.pawify.dto.out.user.BuyerResponseSimpleDTO;
import com.example.pawify.model.BuyerEntity;
import com.example.pawify.service.BuyerService;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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
}
