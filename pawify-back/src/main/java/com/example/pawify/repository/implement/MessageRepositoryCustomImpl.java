package com.example.pawify.repository.implement;

import com.example.pawify.dto.CursorInternalDTO;
import com.example.pawify.model.MessageEntity;
import com.example.pawify.repository.MessageRepositoryCustom;
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
public class MessageRepositoryCustomImpl implements MessageRepositoryCustom {
    private final EntityManager em;

    @Override
    public List<MessageEntity> findMessagesByClaimId(Long claimId, int size, CursorInternalDTO cursor) {
        CriteriaBuilder cb = em.getCriteriaBuilder();
        CriteriaQuery<MessageEntity> cq = cb.createQuery(MessageEntity.class);
        Root<MessageEntity> root = cq.from(MessageEntity.class);

        List<Predicate> predicates = new ArrayList<>();

        idPredicateBuilder(predicates, claimId, cb, root);
        cursorPredicateBuilder(predicates, cursor, cb, root);

        cq.where(predicates.toArray(Predicate[]::new));
        cq.orderBy(cb.desc(root.get("sendAt")), cb.desc(root.get("id")));

        return em.createQuery(cq)
            .setMaxResults(size)
            .getResultList();
    }

    private void idPredicateBuilder (
        List<Predicate> predicates, Long claimId, CriteriaBuilder cb, Root<MessageEntity> root
    ) {
        if (claimId != null) {
            predicates.add(
                cb.equal(root.get("claim").get("id"), claimId)
            );
        }
    }

    private void cursorPredicateBuilder(List<Predicate> predicates, CursorInternalDTO cursor, CriteriaBuilder cb, Root<MessageEntity> root) {
        if (cursor != null) {
            predicates.add(
                cb.or(
                    cb.lessThan(root.get("sendAt"), cursor.instant()),
                    cb.and(
                        cb.equal(root.get("sendAt"), cursor.instant()),
                        cb.lessThan(root.get("id"), cursor.id())
                    )
                )
            );
        }
    }
}
