package com.example.pawify.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "orders")
@Getter
@Setter
@NoArgsConstructor
public class OrderEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    LocalDateTime orderAt;

    @Column(nullable = false, unique = true)
    private String trackingCode;

    @Column(nullable = false)
    BigDecimal totalPrice;

    @Enumerated(EnumType.STRING)
    private OrderStatus orderStatus;

    @Enumerated(EnumType.STRING)
    private ShippingStatus shippingStatus;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "buyer_id", nullable = false)
    private BuyerEntity buyer;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<DetailEntity> details;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<TrackingStatusEntity> trackings;

    @PrePersist
    public void prePersist() {
        this.orderAt = LocalDateTime.now();
        this.orderStatus = OrderStatus.PAID;
        this.shippingStatus = ShippingStatus.IN_TRANSIT;
    }
}
