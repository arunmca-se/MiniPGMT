package com.minipgmt.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

/**
 * Issue DTO
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class IssueDto {
    private UUID id;
    private String key;
    private String title;
    private String description;
    private String type;
    private String priority;
    private String status;
    private String projectKey;
    private UUID sprintId;
    private UUID parentIssueId;
    private String parentIssueKey; // Key of parent issue for breadcrumb navigation
    private UserSummaryDto assignee;
    private UserSummaryDto reporter;
    private Integer storyPoints;
    private LocalDate dueDate;
    private BigDecimal estimateHours;
    private BigDecimal loggedHours;
    private Long commentCount;
    private Long attachmentCount;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private List<IssueDto> subtasks; // List of subtasks for this issue
}
