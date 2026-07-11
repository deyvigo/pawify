package com.example.pawify.service.implement;

import com.example.pawify.service.CodeGenerator;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;

/**
 * Implementation of {@link CodeGenerator} that generates random alphanumeric codes.
 *
 * <p>Uses {@link java.security.SecureRandom} for cryptographic randomness and
 * a character set consisting of lowercase letters and digits. Codes are used
 * for tracking codes, share codes, and recovery tokens.</p>
 */
@Service
@AllArgsConstructor
public class CodeGeneratorImpl implements CodeGenerator {
    private final String CHARACTERS = "abcdefghijklmnopqrstuvwxyz1234567890";
    private final SecureRandom random = new SecureRandom();

    /**
     * {@inheritDoc}
     */
    @Override
    public String generateCode(int length) {
        StringBuilder code = new StringBuilder(length);
        for (int i = 0; i < length; i++) {
            code.append(CHARACTERS.charAt(random.nextInt(CHARACTERS.length())));
        }

        return code.toString();
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public String generateCode() {
        return generateCode(10);
    }
}
