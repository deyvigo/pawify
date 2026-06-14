package com.example.pawify.repository;

import com.example.pawify.dto.CursorInternalDTO;
import com.example.pawify.model.TrackingStatusEntity;

import java.util.List;

public interface TrackingStatusCustomRepository {
    List<TrackingStatusEntity> getTrackingStatusByTrackingCode(String trackingCode, CursorInternalDTO cursor, int size);
}
