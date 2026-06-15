package com.example.pawify.service;

import com.example.pawify.dto.in.order.OrderCreateRequestDTO;
import com.example.pawify.dto.in.payment.PaymentRequestDTO;
import com.example.pawify.dto.out.payment.PaymentIntentResponseDTO;
import com.example.pawify.dto.out.payment.PublishableKeyDTO;
import com.example.pawify.model.BuyerEntity;

public interface StripeService {
    PublishableKeyDTO getPublishableKey();
    PaymentIntentResponseDTO createPaymentIntent(BuyerEntity buyer, OrderCreateRequestDTO request);
}
