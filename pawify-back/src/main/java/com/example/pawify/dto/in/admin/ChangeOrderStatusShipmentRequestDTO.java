package com.example.pawify.dto.in.admin;

import com.example.pawify.model.ShippingStatus;
import jakarta.validation.constraints.NotNull;

public record ChangeOrderStatusShipmentRequestDTO(
    @NotNull(message = "shipping_status is required")
    ShippingStatus shippingStatus
) {}
