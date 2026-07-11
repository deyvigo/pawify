package com.example.pawify.service.implement;

import com.example.pawify.service.EmailService;
import com.sendgrid.Method;
import com.sendgrid.Request;
import com.sendgrid.Response;
import com.sendgrid.SendGrid;
import com.sendgrid.helpers.mail.Mail;
import com.sendgrid.helpers.mail.objects.Content;
import com.sendgrid.helpers.mail.objects.Email;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Service;

/**
 * Implementation of {@link EmailService} that sends emails via SendGrid.
 *
 * <p>This service is only active in the "prod" profile. It sends HTML-formatted
 * password recovery codes to users using the SendGrid email API. The sender
 * email must be a verified sender in the SendGrid account.</p>
 *
 * <p>Requires the {@code sendgrid.api-key} configuration property to be set.</p>
 */
@Profile("prod")
@Service
public class EmailServiceImpl implements EmailService {
    @Value("${sendgrid.api-key}")
    private String apiKey;

    /**
     * {@inheritDoc}
     */
    @Override
    public void sendRecoveryCodeToEmail(String email, String recoveryCode) {
        Email from = new Email("deyvipgo17@gmail.com"); // debe ser el verificado
        String subject = "CÓDIGO DE RECUPERACIÓN";
        Email to = new Email(email);

        String html = """
            <div style="font-family: Arial, sans-serif; text-align: center;">
                <p>Usa el siguiente código:</p>
                <div style="
                    display: inline-block;
                    padding: 15px 25px;
                    font-size: 24px;
                    font-weight: bold;
                    background-color: #f4f4f4;
                    border-radius: 8px;
                    border: 1px solid #ddd;
                ">
                    %s
                </div>
                <p style="margin-top: 20px;">Expira en 1 hora</p>
            </div>
        """.formatted(recoveryCode);

        Content content = new Content("text/html", html);
        Mail mail = new Mail(from, subject, to, content);

        SendGrid sg = new SendGrid(apiKey);

        Request request = new Request();

        try {
            request.setMethod(Method.POST);
            request.setEndpoint("mail/send");
            request.setBody(mail.build());

            Response response = sg.api(request);

            if (response.getStatusCode() >= 400) {
                throw new RuntimeException("Error enviando email: " + response.getBody());
            }

        } catch (Exception e) {
            throw new RuntimeException("Fallo enviando email", e);
        }
    }
}
