package com.example.pawify.controller;

import com.example.pawify.dto.in.order.OrderCreateRequestDTO;
import com.example.pawify.dto.out.order.OrderResponseDTO;
import com.example.pawify.model.BuyerEntity;
import com.example.pawify.service.OrderService;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/order")
@AllArgsConstructor
public class OrderController {
    private final OrderService orderService;

    @PostMapping("")
    public ResponseEntity<OrderResponseDTO> createOrder(
        @AuthenticationPrincipal BuyerEntity buyerEntity,
        @Valid @RequestBody OrderCreateRequestDTO orderCreateRequestDTO
        ) {
        return ResponseEntity.ok(orderService.createOrder(buyerEntity, orderCreateRequestDTO));
    }

    @GetMapping("")
    public ResponseEntity<Slice<OrderResponseDTO>> getOrdersByBuyer(
        @AuthenticationPrincipal BuyerEntity buyerEntity,
        Pageable pageable
    ) {
        return ResponseEntity.ok(orderService.getOrdersByBuyer(buyerEntity, pageable));
    }

    @GetMapping("/{trackingCode}")
    public ResponseEntity<OrderResponseDTO> getOrdersByTrackingCode(
        @PathVariable String trackingCode
    ) {
        return ResponseEntity.ok(orderService.getOrderByTrackingCode(trackingCode));
    }
}
