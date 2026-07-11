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

/**
 * REST controller for order tracking status operations.
 * <p>
 * Provides endpoints for creating tracking status updates (admin-only) and
 * retrieving the tracking history of an order by its tracking code.
 * </p>
 */
@RestController
@RequestMapping("/tracking-status")
@AllArgsConstructor
public class TrackingStatusController {
    private final TrackingStatusService trackingStatusService;

    /**
     * Creates a new tracking status entry for an order.
     * <p>
     * Restricted to administrators.
     * </p>
     *
     * @param requestDTO the validated tracking status creation request containing tracking code and status details
     * @return {@link ResponseEntity} with HTTP 200 (OK) and the created tracking status data
     */
    @PostMapping("")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<TrackingStatusResponseDTO> createTrackingStatus(
        @Valid @RequestBody TrackingStatusCreateRequestDTO requestDTO
    ) {
        return ResponseEntity.ok(trackingStatusService.createTrackingStatus(
            requestDTO
        ));
    }

    /**
     * Retrieves a cursor-paginated list of tracking status entries for a given order.
     * <p>
     * This endpoint is publicly accessible (no authentication required), allowing
     * anyone with the tracking code to view the shipping progress.
     * </p>
     *
     * @param trackingCode the unique tracking code of the order
     * @param size optional page size (defaults to service-defined default if not provided)
     * @param cursor optional cursor value for cursor-based pagination (ID of the last item from the previous page)
     * @return {@link ResponseEntity} with HTTP 200 (OK) and a {@link Page} of tracking status responses
     */
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
