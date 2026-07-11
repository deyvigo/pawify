package com.example.pawify.service;

import org.springframework.web.multipart.MultipartFile;

// Servicio de subida de imagenes a Cloudinary
public interface CloudinaryService {

    // Sube una imagen y retorna la URL segura del recurso
    String uploadImage(MultipartFile file);
}
