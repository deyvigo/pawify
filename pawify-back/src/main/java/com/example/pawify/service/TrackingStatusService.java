package com.example.pawify.service;

import com.example.pawify.dto.in.order.TrackingStatusCreateRequestDTO;
import com.example.pawify.dto.out.Page;
import com.example.pawify.dto.out.order.TrackingStatusResponseDTO;

/**
 * Service interface for managing order tracking status entries.
 *
 * <p>Provides operations for creating tracking status updates and
 * retrieving paginated tracking histories using cursor-based pagination.</p>
 */
public interface TrackingStatusService {

    /**
     * Creates a new tracking status entry for an order.
     *
     * @param requestDTO the data transfer object containing the order ID and tracking status details
     * @return the response DTO with the created tracking status information
     * @throws com.example.pawify.exception.ResourceNotFoundException if the referenced order is not found
     */
    TrackingStatusResponseDTO createTrackingStatus(TrackingStatusCreateRequestDTO requestDTO);

    /**
     * Retrieves a cursor-based paginated list of tracking status entries for an order.
     *
     * <p>Uses cursor-based pagination where the cursor is the ID of the last
     * returned element. Results are ordered by timestamp in descending order.
     * The default page size is 10 if no size is specified.</p>
     *
     * @param trackingCode the tracking code identifying the order
     * @param cursor the ID of the last element from the previous page, or null for the first page
     * @param size the number of elements per page, or null for the default size
     * @return a paginated result containing the tracking status entries and next cursor
     * @throws com.example.pawify.exception.ResourceNotFoundException if no order matches the tracking code
     */
    Page<TrackingStatusResponseDTO> getAllByTrackingCode(String trackingCode, Long cursor, Integer size);
}
