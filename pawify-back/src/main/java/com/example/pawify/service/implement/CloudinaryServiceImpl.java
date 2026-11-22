package com.example.pawify.service.implement;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.example.pawify.service.CloudinaryService;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

// Implementacion del servicio de subida de imagenes a Cloudinary
@Service
@AllArgsConstructor
public class CloudinaryServiceImpl implements CloudinaryService {
    private final Cloudinary cloudinary;

    // Sube imagen a Cloudinary y retorna su URL segura y su public_id
    @Override
    public UploadedImage uploadImage(MultipartFile file) {
        try {
            Map uploadResult = cloudinary.uploader().upload(
                file.getBytes(),
                ObjectUtils.asMap(
                    "folder", "pawify"
                )
            );
            return new UploadedImage(
                uploadResult.get("secure_url").toString(),
                uploadResult.get("public_id").toString()
            );
        } catch (IOException e) {
            throw new RuntimeException("Failed to upload image to Cloudinary", e);
        }
    }
}
