package com.minipgmt.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

/**
 * Project DTO
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProjectDto {
    private UUID id;
    private String key;
    private String name;
    private String description;
    private String health;
    private Integer progress;
    private LocalDate dueDate;
    private UserSummaryDto createdBy;
    private List<UserSummaryDto> members;
    private IssueCountDto issueCount;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class IssueCountDto {
        private Long total;
        private Long completed;
    }
}
