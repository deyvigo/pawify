package com.example.pawify.service;

import org.springframework.web.multipart.MultipartFile;

// Servicio de subida de imagenes a Cloudinary
public interface CloudinaryService {

    // Resultado de una subida: URL publica actual y public_id del recurso
    record UploadedImage(String url, String publicId) {}

    // Sube una imagen y retorna su URL y su public_id
    UploadedImage uploadImage(MultipartFile file);
}
