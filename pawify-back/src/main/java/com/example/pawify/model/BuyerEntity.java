package com.example.pawify.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Entity
@Table(name = "buyers")
@PrimaryKeyJoinColumn(name = "id")
@Getter
@Setter
@NoArgsConstructor
public class BuyerEntity extends UserEntity {
    @Column(nullable = false, unique = true)
    private String email;

    @OneToMany(mappedBy = "buyer", fetch = FetchType.LAZY)
    private List<AddressEntity> addresses;

    @OneToMany(mappedBy = "buyer", fetch = FetchType.LAZY)
    private List<CardEntity> cards;

    @OneToOne(mappedBy = "buyer", cascade = CascadeType.ALL)
    private BuyerImageEntity profile;

    @OneToMany(mappedBy = "buyer", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<ReviewEntity> reviews;
}
