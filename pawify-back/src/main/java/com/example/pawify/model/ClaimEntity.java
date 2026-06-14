package com.example.pawify.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.Instant;
import java.util.List;

@Entity
@Table(name = "claims")
@Getter
@Setter
@NoArgsConstructor
public class ClaimEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(optional = false)
    @JoinColumn(name = "detail_id", nullable = false, unique = true)
    private DetailEntity detail;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "admin_id", nullable = false)
    private AdminEntity admin;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "buyer_id", nullable = false)
    private BuyerEntity buyer;

    @OneToMany(mappedBy = "claim", fetch = FetchType.LAZY)
    private List<MessageEntity> messages;

    @Column(nullable = false)
    private Instant lastModified;

    private String lastMessage;

    @Enumerated(EnumType.STRING)
    private LastMessageSender lastMessageSender;

    @PrePersist
    public void prePersist() {
        this.lastModified = Instant.now();
    }
}
