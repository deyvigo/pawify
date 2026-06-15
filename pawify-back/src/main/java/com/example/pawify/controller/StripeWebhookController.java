package com.example.pawify.controller;

import com.example.pawify.model.OrderStatus;
import com.example.pawify.service.OrderService;
import com.stripe.exception.SignatureVerificationException;
import com.stripe.model.Charge;
import com.stripe.model.Event;
import com.stripe.model.PaymentIntent;
import com.stripe.net.Webhook;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/webhook")
@RequiredArgsConstructor
public class StripeWebhookController {
    private final OrderService orderService;
    @Value("${stripe.webhook-secret}")
    private String webhookSecret;

    @PostMapping("")
    public ResponseEntity<String> handleWebhook (
        @RequestBody String payload,
        @RequestHeader("Stripe-Signature") String sigHeader
    ) {
        Event event;
        try {
            event = Webhook.constructEvent(payload, sigHeader, webhookSecret);
        } catch (SignatureVerificationException e) {
            return ResponseEntity.badRequest().body("Invalid signature");
        }

        switch (event.getType()) {
            case "payment_intent.succeeded",
                 "payment_intent.payment_failed",
                 "payment_intent.canceled" -> {
                PaymentIntent intent = (PaymentIntent) event.getDataObjectDeserializer()
                    .getObject()
                    .orElseThrow();
                String orderId = intent.getMetadata().get("order_id");
                OrderStatus orderStatus = switch (event.getType()) {
                    case "payment_intent.succeeded" -> OrderStatus.PAID;
                    case "payment_intent.payment_failed" -> OrderStatus.FAILED;
                    default -> OrderStatus.CANCELED;
                };
                orderService.updateOrderStatusByOrderId(Long.parseLong(orderId), orderStatus);
            }
            case "charge.dispute.created" -> {
                Charge charge = (Charge) event.getDataObjectDeserializer()
                    .getObject()
                    .orElseThrow();

                log.warn("Chargeback recibido para charge: {}", charge.getId());
            }
        }

        return ResponseEntity.ok("received");
    }
}
