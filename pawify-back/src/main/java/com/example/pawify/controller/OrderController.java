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
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

/**
 * REST controller for order management operations.
 * <p>
 * Provides endpoints for creating orders, retrieving orders by buyer,
 * and looking up orders by tracking code.
 * </p>
 */
@RestController
@RequestMapping("/order")
@AllArgsConstructor
public class OrderController {
    private final OrderService orderService;

    /**
     * Creates a new order for the authenticated buyer.
     *
     * @param buyerEntity the authenticated buyer extracted from the security context
     * @param orderCreateRequestDTO the validated order creation request containing items and shipping details
     * @return {@link ResponseEntity} with HTTP 200 (OK) and the created order data
     */
    @PreAuthorize("hasRole('BUYER')")
    @PostMapping("")
    public ResponseEntity<OrderResponseDTO> createOrder(
        @AuthenticationPrincipal BuyerEntity buyerEntity,
        @Valid @RequestBody OrderCreateRequestDTO orderCreateRequestDTO
        ) {
        return ResponseEntity.ok(orderService.createOrder(buyerEntity, orderCreateRequestDTO));
    }

    /**
     * Retrieves a paginated slice of orders belonging to the authenticated buyer.
     *
     * @param buyerEntity the authenticated buyer extracted from the security context
     * @param pageable pagination parameters (page, size, sort)
     * @return {@link ResponseEntity} with HTTP 200 (OK) and a {@link Slice} of order responses
     */
    @PreAuthorize("hasRole('BUYER')")
    @GetMapping("")
    public ResponseEntity<Slice<OrderResponseDTO>> getOrdersByBuyer(
        @AuthenticationPrincipal BuyerEntity buyerEntity,
        Pageable pageable
    ) {
        return ResponseEntity.ok(orderService.getOrdersByBuyer(buyerEntity, pageable));
    }

    /**
     * Retrieves a single order by its tracking code.
     * <p>
     * This endpoint is publicly accessible (no authentication required).
     * </p>
     *
     * @param trackingCode the unique tracking code of the order
     * @return {@link ResponseEntity} with HTTP 200 (OK) and the matching order data
     */
    @GetMapping("/{trackingCode}")
    public ResponseEntity<OrderResponseDTO> getOrdersByTrackingCode(
        @PathVariable String trackingCode
    ) {
        return ResponseEntity.ok(orderService.getOrderByTrackingCode(trackingCode));
    }
}
