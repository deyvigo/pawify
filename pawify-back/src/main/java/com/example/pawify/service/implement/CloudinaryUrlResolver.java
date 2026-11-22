package com.example.pawify.service.implement;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * Arma la URL publica de una imagen usando SIEMPRE el cloud configurado
 * en el .env. La base de datos guarda el public_id (o la URL historica),
 * nunca el cloud como fuente de verdad.
 */
@Component
public class CloudinaryUrlResolver {
    private static final Pattern CLOUDINARY_URL =
        Pattern.compile("^(https://res\\.cloudinary\\.com/)([^/]+)(/.*)$");

    @Value("${cloudinary.cloud-name}")
    private String cloudName;

    public String resolve(String publicId, String storedUrl) {
        if (publicId != null && !publicId.isBlank()) {
            return "https://res.cloudinary.com/" + cloudName + "/image/upload/" + publicId;
        }

        if (storedUrl == null || storedUrl.isBlank()) {
            return storedUrl;
        }

        // Compatibilidad con filas viejas sin public_id: se reemplaza el cloud
        // de la URL por el del .env, conservando version y extension.
        Matcher matcher = CLOUDINARY_URL.matcher(storedUrl);
        if (matcher.matches()) {
            return matcher.group(1) + cloudName + matcher.group(3);
        }

        return storedUrl;
    }
}
