package com.example.pawify.service;

import com.example.pawify.dto.in.order.TrackingStatusCreateRequestDTO;
import com.example.pawify.dto.out.Page;
import com.example.pawify.dto.out.order.TrackingStatusResponseDTO;

// Servicio de gestion de estados de tracking de ordenes
public interface TrackingStatusService {

    // Crea una entrada de estado de tracking para una orden
    TrackingStatusResponseDTO createTrackingStatus(TrackingStatusCreateRequestDTO requestDTO);

    // Lista el historial de tracking de una orden con paginacion por cursor
    Page<TrackingStatusResponseDTO> getAllByTrackingCode(String trackingCode, String cursor, Integer size);
}
