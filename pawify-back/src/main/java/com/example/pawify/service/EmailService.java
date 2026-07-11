package com.example.pawify.service;

// Servicio de envio de emails transaccionales
public interface EmailService {

    // Envia un codigo de recuperacion de contrasena por email
    void sendRecoveryCodeToEmail(String email, String recoveryCode);
}
