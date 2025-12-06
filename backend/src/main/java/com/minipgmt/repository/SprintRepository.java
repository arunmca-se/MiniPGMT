package com.minipgmt.repository;

import com.minipgmt.domain.Sprint;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

/**
 * Repository for Sprint entity
 */
@Repository
public interface SprintRepository extends JpaRepository<Sprint, UUID> {

    /**
     * Find sprints by project
     */
    List<Sprint> findByProjectId(UUID projectId);

    /**
     * Find sprints by project and status
     */
    List<Sprint> findByProjectIdAndStatus(UUID projectId, Sprint.SprintStatus status);

    /**
     * Find active sprint for project
     */
    List<Sprint> findByProjectIdAndStatusOrderByStartDateDesc(UUID projectId, Sprint.SprintStatus status);
}
