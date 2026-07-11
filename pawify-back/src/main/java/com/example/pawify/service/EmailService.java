package com.example.pawify.service;

/**
 * Service interface for sending emails.
 *
 * <p>Provides operations for delivering transactional emails, such as
 * password recovery codes, to users.</p>
 */
public interface EmailService {

    /**
     * Sends a password recovery code to the specified email address.
     *
     * <p>The recovery code is embedded in an HTML email body and delivered
     * via the configured email provider (SendGrid).</p>
     *
     * @param email the recipient's email address
     * @param recoveryCode the plain-text recovery code to include in the email
     * @throws RuntimeException if the email could not be sent
     */
    void sendRecoveryCodeToEmail(String email, String recoveryCode);
}
