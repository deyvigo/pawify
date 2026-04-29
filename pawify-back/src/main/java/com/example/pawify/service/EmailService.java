package com.example.pawify.service;

import jakarta.mail.MessagingException;

public interface EmailService {
    void sendRecoveryCodeToEmail(String email, String recoveryCode) throws MessagingException;
}
