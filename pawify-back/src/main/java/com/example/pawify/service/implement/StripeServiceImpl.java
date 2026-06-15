package com.example.pawify.service.implement;

import com.example.pawify.dto.in.order.OrderCreateRequestDTO;
import com.example.pawify.dto.out.order.OrderResponseDTO;
import com.example.pawify.dto.out.payment.PaymentIntentResponseDTO;
import com.example.pawify.dto.out.payment.PublishableKeyDTO;
import com.example.pawify.model.BuyerEntity;
import com.example.pawify.service.OrderService;
import com.example.pawify.service.StripeService;
import com.stripe.exception.StripeException;
import com.stripe.model.Customer;
import com.stripe.model.EphemeralKey;
import com.stripe.model.PaymentIntent;
import com.stripe.param.CustomerCreateParams;
import com.stripe.param.EphemeralKeyCreateParams;
import com.stripe.param.PaymentIntentCreateParams;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ServerErrorException;

import java.math.BigDecimal;

@Service
public class StripeServiceImpl implements StripeService {
    private final OrderService orderService;

    @Value("${stripe.publishable-key}")
    private String publishableKey;

    public StripeServiceImpl(OrderService orderService) {
        this.orderService = orderService;
    }

    @Override
    public PublishableKeyDTO getPublishableKey() {
        return new PublishableKeyDTO(publishableKey);
    }

    @Override
    public PaymentIntentResponseDTO createPaymentIntent(BuyerEntity buyer, OrderCreateRequestDTO request) {
        OrderResponseDTO orderCreated = orderService.createOrder(buyer, request);

        try {
            CustomerCreateParams customerParams = CustomerCreateParams.builder()
                .setEmail(buyer.getEmail())
                .build();
            Customer customer = Customer.create(customerParams);

            EphemeralKeyCreateParams ephemeralParams = EphemeralKeyCreateParams.builder()
                .setCustomer(customer.getId())
                .setStripeVersion("2024-06-20")
                .build();

            EphemeralKey ephemeralKey = EphemeralKey.create(ephemeralParams);

            Long amountInCents = orderCreated.totalPrice()
                .multiply(BigDecimal.valueOf(100))
                .longValue();

            PaymentIntentCreateParams params = PaymentIntentCreateParams.builder()
                .setAmount(amountInCents)
                .setCurrency("PEN")
                .setCustomer(customer.getId())
                .putMetadata("order_id", String.valueOf(orderCreated.id()))
                .addPaymentMethodType("card")
                .build();

            PaymentIntent intent = PaymentIntent.create(params);
            return new PaymentIntentResponseDTO(
                intent.getClientSecret(),
                ephemeralKey.getSecret(),
                customer.getId(),
                intent.getId(),
                publishableKey
            );
        } catch (StripeException se) {
            se.printStackTrace();
            throw new ServerErrorException("Error creating Stripe PaymentIntent", se);
        }
    }
}
