package com.example.pawify.service.implement;

import com.example.pawify.service.EmailService;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.AllArgsConstructor;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class EmailServiceImpl implements EmailService {
    private final JavaMailSender javaMailSender;

    @Override
    public void sendRecoveryCodeToEmail(String email, String recoveryCode) throws MessagingException {
        MimeMessage message = javaMailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true);

        helper.setTo(email);
        helper.setSubject("CÓDIGO DE RECUPERACIÓN");
        helper.setFrom("Pawify <tuemail@gmail.com>");

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

        helper.setText(html, true);

        javaMailSender.send(message);
    }
}
