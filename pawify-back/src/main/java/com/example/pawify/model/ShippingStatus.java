package com.example.pawify.model;

import java.util.Set;

public enum ShippingStatus {
    IN_TRANSIT,
    DELIVERED;

    private Set<ShippingStatus> allowedNextStatuses;

    static {
        IN_TRANSIT.allowedNextStatuses = Set.of(DELIVERED);
        DELIVERED.allowedNextStatuses = Set.of();
    }

    public boolean canTransitionTo(ShippingStatus nextStatus) {
        return allowedNextStatuses.contains(nextStatus);
    }
}
