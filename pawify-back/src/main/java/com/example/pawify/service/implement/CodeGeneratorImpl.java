package com.example.pawify.service.implement;

import com.example.pawify.service.CodeGenerator;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;

@Service
@AllArgsConstructor
public class CodeGeneratorImpl implements CodeGenerator {
    private final String CHARACTERS = "abcdefghijklmnopqrstuvwxyz1234567890";
    private final SecureRandom random = new SecureRandom();

    @Override
    public String generateCode(int length) {
        StringBuilder code = new StringBuilder(length);
        for (int i = 0; i < length; i++) {
            code.append(CHARACTERS.charAt(random.nextInt(CHARACTERS.length())));
        }

        return code.toString();
    }

    @Override
    public String generateCode() {
        return generateCode(10);
    }
}
