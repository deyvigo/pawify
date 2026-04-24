package com.example.pawify.specifications;

import com.example.pawify.model.BrandEntity;
import com.example.pawify.model.CategoryEntity;
import com.example.pawify.model.ProductEntity;
import jakarta.persistence.criteria.Join;
import org.springframework.data.jpa.domain.Specification;

import java.math.BigDecimal;

public class ProductSpecification {
    public static Specification<ProductEntity> nameContains(String search) {
        return ((root, query, cb) ->
            cb.like(cb.lower(root.get("name")), "%" + search.toLowerCase() + "%"));
    }

    public static Specification<ProductEntity> hasBrand(String brandName) {
        return ((root, query, cb) -> {
            Join<ProductEntity, BrandEntity> brand = root.join("brand");
            return cb.equal(
                cb.lower(brand.get("name")), brandName.toLowerCase()
            );
        });
    }

    public static Specification<ProductEntity> hasCategory(String categoryName) {
        return ((root, query, criteriaBuilder) -> {
            Join<ProductEntity, CategoryEntity> category = root.join("category");
            return criteriaBuilder.equal(
                category.get("name"), categoryName.toLowerCase()
            );
        });
    }

    public static Specification<ProductEntity> priceBetween(BigDecimal min, BigDecimal max) {
        return ((root, query, cb) -> {
            if (min != null && max != null) return cb.between(root.get("price"), min, max);
            if (min != null) return cb.greaterThanOrEqualTo(root.get("price"), min);
            if (max != null) return cb.lessThanOrEqualTo(root.get("price"), max);
            return cb.conjunction();
        });
    }
}
