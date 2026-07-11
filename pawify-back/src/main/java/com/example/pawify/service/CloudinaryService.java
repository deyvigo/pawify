package com.example.pawify.service;

import org.springframework.web.multipart.MultipartFile;

/**
 * Service interface for cloud-based image storage operations.
 *
 * <p>Provides operations for uploading images to the Cloudinary CDN
 * and retrieving their public URLs.</p>
 */
public interface CloudinaryService {

    /**
     * Uploads an image file to Cloudinary and returns the secure URL.
     *
     * <p>The image is stored in the configured Cloudinary folder ("pawify").</p>
     *
     * @param file the image file to upload
     * @return the secure URL of the uploaded image
     * @throws RuntimeException if the upload to Cloudinary fails
     */
    String uploadImage(MultipartFile file);
}
