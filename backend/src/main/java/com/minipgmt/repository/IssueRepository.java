package com.minipgmt.repository;

import com.minipgmt.domain.Issue;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * Repository for Issue entity
 */
@Repository
public interface IssueRepository extends JpaRepository<Issue, UUID> {

    /**
     * Find issue by key
     */
    Optional<Issue> findByKey(String key);

    /**
     * Check if issue key exists
     */
    boolean existsByKey(String key);

    /**
     * Find issues by project
     */
    List<Issue> findByProjectId(UUID projectId);

    /**
     * Find issues by project and status
     */
    List<Issue> findByProjectIdAndStatus(UUID projectId, String status);

    /**
     * Find issues assigned to user
     */
    List<Issue> findByAssigneeId(UUID assigneeId);

    /**
     * Find issues by sprint
     */
    List<Issue> findBySprintId(UUID sprintId);

    /**
     * Find subtasks of an issue
     */
    List<Issue> findByParentIssueId(UUID parentIssueId);

    /**
     * Get next issue number for project
     */
    @Query("SELECT COUNT(i) FROM Issue i WHERE i.project.id = :projectId")
    long countByProjectId(@Param("projectId") UUID projectId);

    /**
     * Find issues by project with filters
     */
    @Query("SELECT i FROM Issue i WHERE i.project.id = :projectId " +
           "AND (:status IS NULL OR i.status = :status) " +
           "AND (:assigneeId IS NULL OR i.assignee.id = :assigneeId) " +
           "AND (:type IS NULL OR i.type = :type)")
    List<Issue> findByProjectIdWithFilters(
            @Param("projectId") UUID projectId,
            @Param("status") String status,
            @Param("assigneeId") UUID assigneeId,
            @Param("type") Issue.IssueType type
    );
}
