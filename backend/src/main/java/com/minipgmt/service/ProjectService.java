package com.minipgmt.service;

import com.minipgmt.domain.Project;
import com.minipgmt.domain.User;
import com.minipgmt.dto.ProjectDto;
import com.minipgmt.dto.UserSummaryDto;
import com.minipgmt.repository.IssueRepository;
import com.minipgmt.repository.ProjectRepository;
import com.minipgmt.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

/**
 * Project Service
 * Business logic for project management
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class ProjectService {

    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;
    private final IssueRepository issueRepository;

    /**
     * Get all projects
     */
    @Transactional(readOnly = true)
    public List<ProjectDto> getAllProjects() {
        return projectRepository.findAll().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    /**
     * Get project by key
     */
    @Transactional(readOnly = true)
    public ProjectDto getProjectByKey(String key) {
        Project project = projectRepository.findByKey(key)
                .orElseThrow(() -> new RuntimeException("Project not found: " + key));
        return mapToDto(project);
    }

    /**
     * Get projects by user (member of)
     */
    @Transactional(readOnly = true)
    public List<ProjectDto> getProjectsByUserId(UUID userId) {
        return projectRepository.findByMemberId(userId).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    /**
     * Create new project
     */
    @Transactional
    public ProjectDto createProject(ProjectDto dto, UUID createdById) {
        // Check if key already exists
        if (projectRepository.existsByKey(dto.getKey())) {
            throw new RuntimeException("Project key already exists: " + dto.getKey());
        }

        User createdBy = userRepository.findById(createdById)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Project project = Project.builder()
                .key(dto.getKey())
                .name(dto.getName())
                .description(dto.getDescription())
                .health(dto.getHealth() != null ?
                    Project.ProjectHealth.valueOf(dto.getHealth().toUpperCase().replace("TRACK", "_TRACK")) :
                    Project.ProjectHealth.ON_TRACK)
                .progress(dto.getProgress() != null ? dto.getProgress() : 0)
                .dueDate(dto.getDueDate())
                .createdBy(createdBy)
                .build();

        // Add creator as admin member
        project.getMembers().add(createdBy);

        project = projectRepository.save(project);
        log.info("Project created: {}", project.getKey());

        return mapToDto(project);
    }

    /**
     * Update project
     */
    @Transactional
    public ProjectDto updateProject(String key, ProjectDto dto) {
        Project project = projectRepository.findByKey(key)
                .orElseThrow(() -> new RuntimeException("Project not found: " + key));

        if (dto.getName() != null) {
            project.setName(dto.getName());
        }
        if (dto.getDescription() != null) {
            project.setDescription(dto.getDescription());
        }
        if (dto.getHealth() != null) {
            project.setHealth(Project.ProjectHealth.valueOf(
                dto.getHealth().toUpperCase().replace("TRACK", "_TRACK")
            ));
        }
        if (dto.getProgress() != null) {
            project.setProgress(dto.getProgress());
        }
        if (dto.getDueDate() != null) {
            project.setDueDate(dto.getDueDate());
        }

        project = projectRepository.save(project);
        log.info("Project updated: {}", project.getKey());

        return mapToDto(project);
    }

    /**
     * Delete project
     */
    @Transactional
    public void deleteProject(String key) {
        Project project = projectRepository.findByKey(key)
                .orElseThrow(() -> new RuntimeException("Project not found: " + key));

        projectRepository.delete(project);
        log.info("Project deleted: {}", key);
    }

    /**
     * Map Project entity to DTO
     */
    private ProjectDto mapToDto(Project project) {
        // Count issues
        long totalIssues = issueRepository.countByProjectId(project.getId());
        long completedIssues = issueRepository.findByProjectIdAndStatus(project.getId(), "done").size();

        return ProjectDto.builder()
                .id(project.getId())
                .key(project.getKey())
                .name(project.getName())
                .description(project.getDescription())
                .health(project.getHealth() != null ? project.getHealth().getValue() : null)
                .progress(project.getProgress())
                .dueDate(project.getDueDate())
                .createdBy(mapUserToSummaryDto(project.getCreatedBy()))
                .members(project.getMembers().stream()
                        .map(this::mapUserToSummaryDto)
                        .collect(Collectors.toList()))
                .issueCount(ProjectDto.IssueCountDto.builder()
                        .total(totalIssues)
                        .completed(completedIssues)
                        .build())
                .createdAt(project.getCreatedAt())
                .updatedAt(project.getUpdatedAt())
                .build();
    }

    /**
     * Map User to UserSummaryDto
     */
    private UserSummaryDto mapUserToSummaryDto(User user) {
        return UserSummaryDto.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .avatarUrl(user.getAvatarUrl())
                .role(user.getRole().name().toLowerCase())
                .build();
    }
}
