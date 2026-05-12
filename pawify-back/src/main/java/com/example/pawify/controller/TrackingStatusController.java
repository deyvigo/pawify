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

@RestController
@RequestMapping("/trackingstatus")
@AllArgsConstructor
public class TrackingStatusController {
    private final TrackingStatusService trackingStatusService;

    @PostMapping("")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<TrackingStatusResponseDTO> createTrackingStatus(
        @Valid @RequestBody TrackingStatusCreateRequestDTO requestDTO
    ) {
        return ResponseEntity.ok(trackingStatusService.createTrackingStatus(
            requestDTO
        ));
    }

    @GetMapping("/{trackingCode}")
    public ResponseEntity<Page<TrackingStatusResponseDTO>> getTrackingStatusesByOrder(
        @PathVariable String trackingCode,
        @RequestParam(name = "size", required = false) int size,
        @RequestParam(name = "cursor", required = false) Long cursor
    ) {
        return ResponseEntity.ok(
            trackingStatusService.getAllByTrackingCode(
                trackingCode, cursor, size
            )
        );
    }
}
