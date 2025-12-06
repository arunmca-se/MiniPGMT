package com.minipgmt.domain;

import jakarta.persistence.*;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;

import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;

/**
 * Project Entity
 * Represents a project that contains issues and sprints
 */
@Entity
@Table(name = "projects", indexes = {
    @Index(name = "idx_projects_key", columnList = "key", unique = true)
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Project extends BaseEntity {

    @NotBlank(message = "Project key is required")
    @Size(max = 10, message = "Project key must not exceed 10 characters")
    @Column(name = "key", unique = true, nullable = false, length = 10)
    private String key;

    @NotBlank(message = "Project name is required")
    @Size(max = 255, message = "Project name must not exceed 255 characters")
    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(name = "health", length = 50)
    private ProjectHealth health;

    @Min(value = 0, message = "Progress must be at least 0")
    @Max(value = 100, message = "Progress must not exceed 100")
    @Column(name = "progress")
    @Builder.Default
    private Integer progress = 0;

    @Column(name = "due_date")
    private LocalDate dueDate;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "created_by", nullable = false)
    private User createdBy;

    @ManyToMany
    @JoinTable(
        name = "project_members",
        joinColumns = @JoinColumn(name = "project_id"),
        inverseJoinColumns = @JoinColumn(name = "user_id")
    )
    @Builder.Default
    private Set<User> members = new HashSet<>();

    /**
     * Project health status
     */
    public enum ProjectHealth {
        ON_TRACK("onTrack"),
        AT_RISK("atRisk"),
        BEHIND("behind");

        private final String value;

        ProjectHealth(String value) {
            this.value = value;
        }

        public String getValue() {
            return value;
        }
    }
}
