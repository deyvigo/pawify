package com.example.pawify.config;

import com.example.pawify.service.CloudinaryService;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Primary;
import org.springframework.web.multipart.MultipartFile;

@TestConfiguration
public class TestCloudinaryConfig {

    @Bean
    @Primary
    public CloudinaryService cloudinaryService() {
        return new CloudinaryService() {
            @Override
            public String uploadImage(MultipartFile file) {
                return "http://test-cloudinary.com/image.jpg";
            }
        };
    }
}
