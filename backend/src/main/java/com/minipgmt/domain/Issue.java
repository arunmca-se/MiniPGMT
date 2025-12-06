package com.minipgmt.domain;

import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;

/**
 * Issue Entity
 * Represents a work item (Epic, Story, Task, Bug, Subtask)
 */
@Entity
@Table(name = "issues", indexes = {
    @Index(name = "idx_issues_project_id", columnList = "project_id"),
    @Index(name = "idx_issues_sprint_id", columnList = "sprint_id"),
    @Index(name = "idx_issues_assignee_id", columnList = "assignee_id"),
    @Index(name = "idx_issues_reporter_id", columnList = "reporter_id"),
    @Index(name = "idx_issues_status", columnList = "status"),
    @Index(name = "idx_issues_due_date", columnList = "due_date"),
    @Index(name = "idx_issues_project_status", columnList = "project_id, status")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Issue extends BaseEntity {

    @NotBlank(message = "Issue key is required")
    @Size(max = 20, message = "Issue key must not exceed 20 characters")
    @Column(name = "key", unique = true, nullable = false, length = 20)
    private String key;

    @NotBlank(message = "Title is required")
    @Size(max = 500, message = "Title must not exceed 500 characters")
    @Column(name = "title", nullable = false, length = 500)
    private String title;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(name = "type", nullable = false, length = 50)
    private IssueType type;

    @Enumerated(EnumType.STRING)
    @Column(name = "priority", nullable = false, length = 50)
    private IssuePriority priority;

    @NotBlank(message = "Status is required")
    @Size(max = 50)
    @Column(name = "status", nullable = false, length = 50)
    private String status;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "project_id", nullable = false)
    private Project project;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "sprint_id")
    private Sprint sprint;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "parent_issue_id")
    private Issue parentIssue;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "assignee_id")
    private User assignee;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "reporter_id", nullable = false)
    private User reporter;

    @Min(value = 0, message = "Story points must be non-negative")
    @Column(name = "story_points")
    private Integer storyPoints;

    @Column(name = "due_date")
    private LocalDate dueDate;

    @Column(name = "estimate_hours", precision = 10, scale = 2)
    private BigDecimal estimateHours;

    @Column(name = "logged_hours", precision = 10, scale = 2)
    @Builder.Default
    private BigDecimal loggedHours = BigDecimal.ZERO;

    /**
     * Issue types
     */
    public enum IssueType {
        EPIC,       // Large body of work
        STORY,      // User story
        TASK,       // Task to be done
        BUG,        // Bug to be fixed
        SUBTASK     // Sub-task of another issue
    }

    /**
     * Issue priorities
     */
    public enum IssuePriority {
        LOWEST,
        LOW,
        MEDIUM,
        HIGH,
        HIGHEST
    }
}
