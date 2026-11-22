package com.example.pawify.config;

import com.example.pawify.service.implement.CloudinaryUrlResolver;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Map;

/**
 * Al arrancar, completa el public_id de las imagenes historicas y reescribe
 * su URL con el cloud configurado en el .env. Asi la base de datos deja de
 * depender del cloud que tenia escrito cuando se subio la imagen.
 *
 * Es idempotente: se puede ejecutar en cada arranque sin efectos duplicados.
 */
@Slf4j
@Component
@AllArgsConstructor
public class CloudinaryImageBackfill implements ApplicationRunner {
    private static final List<String> IMAGE_TABLES =
        List.of("product_images", "review_images", "buyer_images");
    private static final String UPLOAD_PATH = "/image/upload/";

    private final JdbcTemplate jdbcTemplate;
    private final CloudinaryUrlResolver urlResolver;

    @Override
    public void run(ApplicationArguments args) {
        for (String table : IMAGE_TABLES) {
            List<Map<String, Object>> rows =
                jdbcTemplate.queryForList("SELECT id, url FROM " + table);

            int updated = 0;

            for (Map<String, Object> row : rows) {
                Long id = ((Number) row.get("id")).longValue();
                String url = (String) row.get("url");
                String publicId = extractPublicId(url);

                if (publicId == null) {
                    continue;
                }

                jdbcTemplate.update(
                    "UPDATE " + table + " SET public_id = ?, url = ? WHERE id = ?",
                    publicId,
                    urlResolver.resolve(publicId, url),
                    id
                );
                updated++;
            }

            log.info("Cloudinary backfill {}: {} de {} imagenes sincronizadas", table, updated, rows.size());
        }
    }

    /** Extrae el public_id de una URL de Cloudinary, sin version ni extension. */
    private String extractPublicId(String url) {
        if (url == null) {
            return null;
        }

        int index = url.indexOf(UPLOAD_PATH);
        if (index < 0) {
            return null;
        }

        String rest = url.substring(index + UPLOAD_PATH.length());

        // Quita el segmento de version (v123456789)
        int slash = rest.indexOf('/');
        if (rest.startsWith("v") && slash > 0 && rest.substring(1, slash).matches("\\d+")) {
            rest = rest.substring(slash + 1);
        }

        // Quita query string y extension
        int query = rest.indexOf('?');
        if (query >= 0) {
            rest = rest.substring(0, query);
        }

        int lastSlash = rest.lastIndexOf('/');
        int dot = rest.lastIndexOf('.');
        if (dot > lastSlash) {
            rest = rest.substring(0, dot);
        }

        return rest;
    }
}
