package com.example.pawify.config;

import com.stripe.Stripe;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

@Configuration
public class StripeConfiguration {
    @Value("${stripe.secret-key}")
    String publishableKey;

    @PostConstruct
    public void init() {
        Stripe.apiKey = publishableKey;
    }
}
