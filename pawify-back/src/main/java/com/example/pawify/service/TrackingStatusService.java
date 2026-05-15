package com.example.pawify.service;

import com.example.pawify.dto.in.order.TrackingStatusCreateRequestDTO;
import com.example.pawify.dto.out.Page;
import com.example.pawify.dto.out.order.TrackingStatusResponseDTO;

public interface TrackingStatusService {
    TrackingStatusResponseDTO createTrackingStatus(TrackingStatusCreateRequestDTO requestDTO);
    Page<TrackingStatusResponseDTO> getAllByTrackingCode(String trackingCode, Long cursor, int size);
}
