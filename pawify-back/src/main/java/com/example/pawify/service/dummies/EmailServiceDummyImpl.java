package com.example.pawify.service.dummies;

import com.example.pawify.service.EmailService;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Service;

@Profile("!prod")
@Service
public class EmailServiceDummyImpl implements EmailService {
    @Override
    public void sendRecoveryCodeToEmail(String email, String recoveryCode) {
        System.out.println("[DUMMY] Email sent to " + email + " with recovery code " + recoveryCode);
    }
}
