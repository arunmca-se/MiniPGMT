package com.minipgmt.repository;

import com.minipgmt.domain.Project;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * Repository for Project entity
 */
@Repository
public interface ProjectRepository extends JpaRepository<Project, UUID> {

    /**
     * Find project by key
     */
    Optional<Project> findByKey(String key);

    /**
     * Check if project key exists
     */
    boolean existsByKey(String key);

    /**
     * Find all projects where user is a member
     */
    @Query("SELECT p FROM Project p JOIN p.members m WHERE m.id = :userId")
    List<Project> findByMemberId(@Param("userId") UUID userId);

    /**
     * Find projects created by user
     */
    List<Project> findByCreatedById(UUID userId);
}
