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

    @OneToMany(fetch = FetchType.LAZY)
    @JoinColumn(name = "address_id", nullable = true)
    private List<AddressEntity> address;

    @OneToMany(fetch = FetchType.LAZY)
    private List<CardEntity> cards;
}
