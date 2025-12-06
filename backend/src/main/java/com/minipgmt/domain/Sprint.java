package com.minipgmt.domain;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;

import java.time.LocalDate;

/**
 * Sprint Entity
 * Represents a sprint (time-boxed iteration) in agile project management
 */
@Entity
@Table(name = "sprints")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Sprint extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "project_id", nullable = false)
    private Project project;

    @NotBlank(message = "Sprint name is required")
    @Size(max = 255, message = "Sprint name must not exceed 255 characters")
    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "goal", columnDefinition = "TEXT")
    private String goal;

    @NotNull(message = "Start date is required")
    @Column(name = "start_date", nullable = false)
    private LocalDate startDate;

    @NotNull(message = "End date is required")
    @Column(name = "end_date", nullable = false)
    private LocalDate endDate;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 50)
    @Builder.Default
    private SprintStatus status = SprintStatus.PLANNED;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "created_by", nullable = false)
    private User createdBy;

    /**
     * Sprint status
     */
    public enum SprintStatus {
        PLANNED,    // Not yet started
        ACTIVE,     // Currently running
        COMPLETED,  // Finished
        CANCELLED   // Cancelled before completion
    }
}
