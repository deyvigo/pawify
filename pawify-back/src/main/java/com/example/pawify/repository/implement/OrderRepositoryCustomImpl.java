package com.example.pawify.repository.implement;

import com.example.pawify.dto.CursorInternalDTO;
import com.example.pawify.model.BuyerEntity;
import com.example.pawify.model.OrderEntity;
import com.example.pawify.model.OrderStatus;
import com.example.pawify.repository.OrderRepositoryCustom;
import jakarta.persistence.EntityManager;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;

@Repository
@AllArgsConstructor
public class OrderRepositoryCustomImpl implements OrderRepositoryCustom {
    private final EntityManager em;

    @Override
    public List<OrderEntity> findAllWithFilters(
        CursorInternalDTO cursor, BuyerEntity buyer, Integer size, String status, String trackingCode
    ) {
        CriteriaBuilder cb = em.getCriteriaBuilder();
        CriteriaQuery<OrderEntity> cq = cb.createQuery(OrderEntity.class);
        Root<OrderEntity> root = cq.from(OrderEntity.class);

        List<Predicate> predicates = new ArrayList<>();

        if (buyer != null) {
            predicates.add(cb.equal(root.get("buyer").get("id"), buyer.getId()));
        }

        List<String> validStatus = List.of("PAID", "CANCELED", "PENDING", "FAILED");
        if (status != null && !status.isBlank()) {
            String upperStatus = status.toUpperCase();
            if (validStatus.contains(upperStatus)) {
                OrderStatus enumStatus = OrderStatus.valueOf(upperStatus);
                predicates.add(cb.equal(root.get("orderStatus"), enumStatus));
            } else {
                predicates.add(cb.disjunction());
            }
        }

        if (trackingCode != null && !trackingCode.isEmpty()) {
            predicates.add(cb.like(root.get("trackingCode"), trackingCode + "%"));
        }

        cursorPaginateBuilder(cursor, predicates, cb, root);

        cq.where(predicates.toArray(Predicate[]::new));
        cq.orderBy(cb.desc(root.get("orderAt")), cb.desc(root.get("id")));

        return em.createQuery(cq)
            .setMaxResults(size)
            .getResultList();
    }

    private void cursorPaginateBuilder(
        CursorInternalDTO cursor, List<Predicate> predicates, CriteriaBuilder cb, Root<OrderEntity> root
    ) {
        if (cursor != null) {
            predicates.add(
                cb.or(
                    cb.lessThan(root.get("orderAt"), cursor.instant()),
                    cb.and(
                        cb.equal(root.get("orderAt"), cursor.instant()),
                        cb.lessThan(root.get("id"), cursor.id())
                    )
                )
            );
        }
    }
}
