package com.example.pawify.repository.implement;

import com.example.pawify.dto.CursorInternalDTO;
import com.example.pawify.model.TrackingStatusEntity;
import com.example.pawify.repository.TrackingStatusCustomRepository;
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
public class TrackingStatusCustomRepositoryImpl implements TrackingStatusCustomRepository {
    private final EntityManager em;

    @Override
    public List<TrackingStatusEntity> getTrackingStatusByTrackingCode(String trackingCode, CursorInternalDTO cursor, int size) {
        CriteriaBuilder cb = em.getCriteriaBuilder();
        CriteriaQuery<TrackingStatusEntity> cq = cb.createQuery(TrackingStatusEntity.class);
        Root<TrackingStatusEntity> root = cq.from(TrackingStatusEntity.class);

        List<Predicate> predicates = new ArrayList<>();

        trackingCodePredicateBuilder(predicates, cb, root, trackingCode);
        cursorPredicateBuilder(predicates, cb, root, cursor);
        finalize(cq, root, cb, predicates);

        return em
            .createQuery(cq)
            .setMaxResults(size)
            .getResultList();
    }

    private void trackingCodePredicateBuilder(
        List<Predicate> predicates, CriteriaBuilder cb, Root<TrackingStatusEntity> root, String trackingCode
    ) {
        if (trackingCode != null) {
            predicates.add(cb.equal(root.get("order").get("trackingCode"), trackingCode));
        }
    }

    private void cursorPredicateBuilder(
        List<Predicate> predicates, CriteriaBuilder cb, Root<TrackingStatusEntity> root, CursorInternalDTO cursor
    ) {
        if (cursor != null) {
            predicates.add(
                cb.or(
                    cb.lessThan(root.get("timestamp"), cursor.instant()),
                    cb.and(
                        cb.equal(root.get("timestamp"), cursor.instant()),
                        cb.lessThan(root.get("id"), cursor.id())
                    )
                )
            );
        }
    }

    private void finalize(CriteriaQuery<TrackingStatusEntity> cq, Root<TrackingStatusEntity> root, CriteriaBuilder cb, List<Predicate> predicates) {
        cq.where(predicates.toArray(Predicate[]::new));
        cq.orderBy(cb.desc(root.get("timestamp")), cb.desc(root.get("id")));
    }
}
