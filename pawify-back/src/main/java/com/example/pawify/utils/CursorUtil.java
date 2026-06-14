package com.example.pawify.utils;

import com.example.pawify.dto.CursorInternalDTO;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Component;

import java.nio.charset.StandardCharsets;
import java.util.Base64;

@Component
@AllArgsConstructor
public class CursorUtil {
    private final ObjectMapper objectMapper;

    public String encode(CursorInternalDTO cursor) {
        try {
            String json = objectMapper.writeValueAsString(cursor);
            return Base64.getEncoder().encodeToString(json.getBytes(StandardCharsets.UTF_8));
        } catch (Exception e) {
            throw new RuntimeException("Error encoding Cursor", e);
        }
    }

    public CursorInternalDTO decode(String cursor) {
        try {
            byte[] decodedBytes = Base64.getUrlDecoder().decode(cursor);
            String jsonString = new String(decodedBytes, StandardCharsets.UTF_8);
            return objectMapper.readValue(jsonString, CursorInternalDTO.class);
        } catch (Exception e) {
            throw new RuntimeException("Error decoding Cursor", e);
        }
    }
}
