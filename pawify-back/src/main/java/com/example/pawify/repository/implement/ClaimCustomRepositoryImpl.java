package com.example.pawify.repository.implement;

import com.example.pawify.dto.CursorInternalDTO;
import com.example.pawify.model.ClaimEntity;
import com.example.pawify.model.UserEntity;
import com.example.pawify.repository.ClaimCustomRepository;
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
public class ClaimCustomRepositoryImpl implements ClaimCustomRepository {
    private final EntityManager em;

    @Override
    public List<ClaimEntity> findClaimsByUserId(
        UserEntity user, int size, CursorInternalDTO cursor
    ) {
        CriteriaBuilder cb = em.getCriteriaBuilder();
        CriteriaQuery<ClaimEntity> cq = cb.createQuery(ClaimEntity.class);
        Root<ClaimEntity> root = cq.from(ClaimEntity.class);
        List<Predicate>  predicates = new ArrayList<>();

        if (user != null) {
            predicates.add(
                cb.or(
                    cb.equal(root.get("admin").get("id"), user.getId()),
                    cb.equal(root.get("buyer").get("id"), user.getId())
                )
            );
        }

        if (cursor != null) {
            predicates.add(
                cb.or(
                    cb.lessThan(root.get("lastModified"), cursor.instant()),
                    cb.and(
                        cb.equal(root.get("lastModified"), cursor.instant()),
                        cb.lessThan(root.get("id"), cursor.id())
                    )
                )
            );
        }

        cq.where(predicates.toArray(new Predicate[0]));
        cq.orderBy(cb.desc(root.get("lastModified")), cb.desc(root.get("id")));

        return em
            .createQuery(cq)
            .setMaxResults(size)
            .getResultList();
    }
}
