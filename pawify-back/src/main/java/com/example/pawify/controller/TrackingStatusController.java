package com.example.pawify.controller;

import com.example.pawify.dto.in.order.TrackingStatusCreateRequestDTO;
import com.example.pawify.dto.out.Page;
import com.example.pawify.dto.out.order.TrackingStatusResponseDTO;
import com.example.pawify.service.TrackingStatusService;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

// Controlador de estados de rastreo de pedidos
@RestController
@RequestMapping("/tracking-status")
@AllArgsConstructor
public class TrackingStatusController {
    private final TrackingStatusService trackingStatusService;

    // Crea un nuevo estado de rastreo para un pedido (solo admin)
    @PostMapping("")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<TrackingStatusResponseDTO> createTrackingStatus(
        @Valid @RequestBody TrackingStatusCreateRequestDTO requestDTO
    ) {
        return ResponseEntity.ok(trackingStatusService.createTrackingStatus(
            requestDTO
        ));
    }

    // Lista el historial de rastreo de un pedido por su codigo
    @GetMapping("/{trackingCode}")
    public ResponseEntity<Page<TrackingStatusResponseDTO>> getTrackingStatusesByOrder(
        @PathVariable String trackingCode,
        @RequestParam(name = "size", required = false) Integer size,
        @RequestParam(name = "cursor", required = false) Long cursor
    ) {
        return ResponseEntity.ok(
            trackingStatusService.getAllByTrackingCode(
                trackingCode, cursor, size
            )
        );
    }
}
