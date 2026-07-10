package com.example.pawify.controller;

import com.example.pawify.dto.in.order.OrderCreateRequestDTO;
import com.example.pawify.dto.out.payment.PaymentIntentResponseDTO;
import com.example.pawify.dto.out.payment.PublishableKeyDTO;
import com.example.pawify.model.BuyerEntity;
import com.example.pawify.service.StripeService;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/stripe")
@AllArgsConstructor
public class StripeController {
    private StripeService stripeService;

    @GetMapping("/publishable-key")
    public PublishableKeyDTO getPublishableKey() {
        return stripeService.getPublishableKey();
    }

    @PostMapping("/payment-intent")
    public ResponseEntity<PaymentIntentResponseDTO> createIntent(
        @AuthenticationPrincipal BuyerEntity buyer,
        @Valid @RequestBody OrderCreateRequestDTO request
    ) {
        return ResponseEntity.ok(stripeService.createPaymentIntent(buyer, request));
    }
}
