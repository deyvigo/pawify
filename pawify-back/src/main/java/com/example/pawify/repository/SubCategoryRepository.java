package com.example.pawify.repository;

import com.example.pawify.model.SubCategoryEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SubCategoryRepository extends JpaRepository<SubCategoryEntity, Long> {
    Optional<SubCategoryEntity> findByNameIgnoreCaseAndCategory_Name(String name, String categoryName);
    List<SubCategoryEntity> findByOrderByNameAsc();
    List<SubCategoryEntity> findAllByCategory_NameOrderByNameAsc(String categoryName);
}
