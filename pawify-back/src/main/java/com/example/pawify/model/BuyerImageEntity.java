package com.example.pawify.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "buyer_images")
@Getter
@Setter
@NoArgsConstructor
public class BuyerImageEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String url;

    // Identificador del archivo en Cloudinary. Es independiente del cloud:
    // la URL publica se arma con el cloud configurado en el .env.
    @Column(name = "public_id")
    private String publicId;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "buyer_id", nullable = false)
    private BuyerEntity buyer;
}
