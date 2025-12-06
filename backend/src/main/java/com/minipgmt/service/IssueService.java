package com.minipgmt.service;

import com.minipgmt.domain.Issue;
import com.minipgmt.domain.Project;
import com.minipgmt.domain.Sprint;
import com.minipgmt.domain.User;
import com.minipgmt.dto.IssueDto;
import com.minipgmt.dto.UserSummaryDto;
import com.minipgmt.repository.IssueRepository;
import com.minipgmt.repository.ProjectRepository;
import com.minipgmt.repository.SprintRepository;
import com.minipgmt.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

/**
 * Issue Service
 * Business logic for issue management
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class IssueService {

    private final IssueRepository issueRepository;
    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;
    private final SprintRepository sprintRepository;
    private final IssueHierarchyValidator hierarchyValidator;

    /**
     * Get all issues for a project
     */
    @Transactional(readOnly = true)
    public List<IssueDto> getIssuesByProject(String projectKey) {
        Project project = projectRepository.findByKey(projectKey)
                .orElseThrow(() -> new RuntimeException("Project not found: " + projectKey));

        return issueRepository.findByProjectId(project.getId()).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    /**
     * Get issue by key
     */
    @Transactional(readOnly = true)
    public IssueDto getIssueByKey(String key) {
        Issue issue = issueRepository.findByKey(key)
                .orElseThrow(() -> new RuntimeException("Issue not found: " + key));
        return mapToDto(issue);
    }

    /**
     * Get issues by assignee
     */
    @Transactional(readOnly = true)
    public List<IssueDto> getIssuesByAssignee(UUID assigneeId) {
        return issueRepository.findByAssigneeId(assigneeId).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    /**
     * Get issues by sprint
     */
    @Transactional(readOnly = true)
    public List<IssueDto> getIssuesBySprint(UUID sprintId) {
        return issueRepository.findBySprintId(sprintId).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    /**
     * Create new issue
     */
    @Transactional
    public IssueDto createIssue(IssueDto dto, UUID reporterId) {
        // Get project
        Project project = projectRepository.findByKey(dto.getProjectKey())
                .orElseThrow(() -> new RuntimeException("Project not found: " + dto.getProjectKey()));

        // Get reporter
        User reporter = userRepository.findById(reporterId)
                .orElseThrow(() -> new RuntimeException("Reporter not found"));

        // Generate issue key if not provided
        String issueKey = dto.getKey();
        if (issueKey == null || issueKey.isEmpty()) {
            long issueCount = issueRepository.countByProjectId(project.getId());
            issueKey = project.getKey() + "-" + (issueCount + 1);
        }

        // Check if key already exists
        if (issueRepository.existsByKey(issueKey)) {
            throw new RuntimeException("Issue key already exists: " + issueKey);
        }

        // Build issue
        Issue.IssueBuilder builder = Issue.builder()
                .key(issueKey)
                .title(dto.getTitle())
                .description(dto.getDescription())
                .type(Issue.IssueType.valueOf(dto.getType().toUpperCase()))
                .priority(Issue.IssuePriority.valueOf(dto.getPriority().toUpperCase()))
                .status(dto.getStatus() != null ? dto.getStatus() : "todo")
                .project(project)
                .reporter(reporter)
                .storyPoints(dto.getStoryPoints())
                .dueDate(dto.getDueDate())
                .estimateHours(dto.getEstimateHours());

        // Set assignee if provided
        if (dto.getAssignee() != null && dto.getAssignee().getId() != null) {
            User assignee = userRepository.findById(dto.getAssignee().getId())
                    .orElseThrow(() -> new RuntimeException("Assignee not found"));
            builder.assignee(assignee);
        }

        // Set sprint if provided
        if (dto.getSprintId() != null) {
            Sprint sprint = sprintRepository.findById(dto.getSprintId())
                    .orElseThrow(() -> new RuntimeException("Sprint not found"));
            builder.sprint(sprint);
        }

        // Parse issue type
        Issue.IssueType issueType = Issue.IssueType.valueOf(dto.getType().toUpperCase());

        // Validate hierarchy rules
        hierarchyValidator.validateEpicCannotHaveParent(issueType, dto.getParentIssueId());
        hierarchyValidator.validateSubtaskRequiresParent(issueType, dto.getParentIssueId());

        // Set parent issue if provided
        if (dto.getParentIssueId() != null) {
            Issue parentIssue = issueRepository.findById(dto.getParentIssueId())
                    .orElseThrow(() -> new RuntimeException("Parent issue not found"));

            // Validate parent-child relationship
            hierarchyValidator.validateParentChildRelationship(issueType, parentIssue.getType());

            // Validate hierarchy depth
            hierarchyValidator.validateHierarchyDepth(parentIssue.getId());

            builder.parentIssue(parentIssue);
        }

        Issue issue = builder.build();
        issue = issueRepository.save(issue);
        log.info("Issue created: {}", issue.getKey());

        return mapToDto(issue);
    }

    /**
     * Update issue
     */
    @Transactional
    public IssueDto updateIssue(String key, IssueDto dto) {
        Issue issue = issueRepository.findByKey(key)
                .orElseThrow(() -> new RuntimeException("Issue not found: " + key));

        // Update fields if provided
        if (dto.getTitle() != null) {
            issue.setTitle(dto.getTitle());
        }
        if (dto.getDescription() != null) {
            issue.setDescription(dto.getDescription());
        }
        if (dto.getType() != null) {
            issue.setType(Issue.IssueType.valueOf(dto.getType().toUpperCase()));
        }
        if (dto.getPriority() != null) {
            issue.setPriority(Issue.IssuePriority.valueOf(dto.getPriority().toUpperCase()));
        }
        if (dto.getStatus() != null) {
            issue.setStatus(dto.getStatus());
        }
        if (dto.getStoryPoints() != null) {
            issue.setStoryPoints(dto.getStoryPoints());
        }
        if (dto.getDueDate() != null) {
            issue.setDueDate(dto.getDueDate());
        }
        if (dto.getEstimateHours() != null) {
            issue.setEstimateHours(dto.getEstimateHours());
        }

        // Update assignee
        if (dto.getAssignee() != null) {
            if (dto.getAssignee().getId() != null) {
                User assignee = userRepository.findById(dto.getAssignee().getId())
                        .orElseThrow(() -> new RuntimeException("Assignee not found"));
                issue.setAssignee(assignee);
            } else {
                issue.setAssignee(null);
            }
        }

        // Update sprint
        if (dto.getSprintId() != null) {
            Sprint sprint = sprintRepository.findById(dto.getSprintId())
                    .orElseThrow(() -> new RuntimeException("Sprint not found"));
            issue.setSprint(sprint);
        }

        // Update parent issue if provided in DTO
        if (dto.getParentIssueId() != null) {
            // Validate hierarchy rules before updating parent
            hierarchyValidator.validateEpicCannotHaveParent(issue.getType(), dto.getParentIssueId());

            Issue newParent = issueRepository.findById(dto.getParentIssueId())
                    .orElseThrow(() -> new RuntimeException("Parent issue not found"));

            // Validate parent-child relationship
            hierarchyValidator.validateParentChildRelationship(issue.getType(), newParent.getType());

            // Validate circular reference
            hierarchyValidator.validateCircularReference(issue.getId(), newParent.getId());

            // Validate hierarchy depth
            hierarchyValidator.validateHierarchyDepth(newParent.getId());

            issue.setParentIssue(newParent);
        }

        issue = issueRepository.save(issue);
        log.info("Issue updated: {}", issue.getKey());

        return mapToDto(issue);
    }

    /**
     * Delete issue
     */
    @Transactional
    public void deleteIssue(String key) {
        Issue issue = issueRepository.findByKey(key)
                .orElseThrow(() -> new RuntimeException("Issue not found: " + key));

        issueRepository.delete(issue);
        log.info("Issue deleted: {}", key);
    }

    /**
     * Get subtasks for an issue
     */
    @Transactional(readOnly = true)
    public List<IssueDto> getSubtasks(String parentKey) {
        Issue parentIssue = issueRepository.findByKey(parentKey)
                .orElseThrow(() -> new RuntimeException("Parent issue not found: " + parentKey));

        return issueRepository.findByParentIssueId(parentIssue.getId()).stream()
                .map(this::mapToDtoWithoutSubtasks) // Prevent infinite recursion
                .collect(Collectors.toList());
    }

    /**
     * Get subtasks by parent issue ID
     */
    @Transactional(readOnly = true)
    public List<IssueDto> getSubtasksByParentId(UUID parentIssueId) {
        return issueRepository.findByParentIssueId(parentIssueId).stream()
                .map(this::mapToDtoWithoutSubtasks) // Prevent infinite recursion
                .collect(Collectors.toList());
    }

    /**
     * Map Issue entity to DTO with subtasks populated
     */
    private IssueDto mapToDto(Issue issue) {
        IssueDto.IssueDtoBuilder builder = IssueDto.builder()
                .id(issue.getId())
                .key(issue.getKey())
                .title(issue.getTitle())
                .description(issue.getDescription())
                .type(issue.getType().name().toLowerCase())
                .priority(issue.getPriority().name().toLowerCase())
                .status(issue.getStatus())
                .projectKey(issue.getProject().getKey())
                .sprintId(issue.getSprint() != null ? issue.getSprint().getId() : null)
                .parentIssueId(issue.getParentIssue() != null ? issue.getParentIssue().getId() : null)
                .assignee(issue.getAssignee() != null ? mapUserToSummaryDto(issue.getAssignee()) : null)
                .reporter(mapUserToSummaryDto(issue.getReporter()))
                .storyPoints(issue.getStoryPoints())
                .dueDate(issue.getDueDate())
                .estimateHours(issue.getEstimateHours())
                .loggedHours(issue.getLoggedHours())
                .commentCount(0L) // TODO: Count from comment repository
                .attachmentCount(0L) // TODO: Count from attachment repository
                .createdAt(issue.getCreatedAt())
                .updatedAt(issue.getUpdatedAt());

        // Add parent issue key if it has a parent
        if (issue.getParentIssue() != null) {
            builder.parentIssueKey(issue.getParentIssue().getKey());
        }

        // Populate subtasks if issue can have children
        if (hierarchyValidator.canHaveChildren(issue.getType())) {
            List<IssueDto> subtasks = issueRepository.findByParentIssueId(issue.getId()).stream()
                    .map(this::mapToDtoWithoutSubtasks) // Prevent infinite recursion
                    .collect(Collectors.toList());
            builder.subtasks(subtasks);
        }

        return builder.build();
    }

    /**
     * Map Issue entity to DTO without subtasks (to prevent infinite recursion)
     */
    private IssueDto mapToDtoWithoutSubtasks(Issue issue) {
        return IssueDto.builder()
                .id(issue.getId())
                .key(issue.getKey())
                .title(issue.getTitle())
                .description(issue.getDescription())
                .type(issue.getType().name().toLowerCase())
                .priority(issue.getPriority().name().toLowerCase())
                .status(issue.getStatus())
                .projectKey(issue.getProject().getKey())
                .sprintId(issue.getSprint() != null ? issue.getSprint().getId() : null)
                .parentIssueId(issue.getParentIssue() != null ? issue.getParentIssue().getId() : null)
                .parentIssueKey(issue.getParentIssue() != null ? issue.getParentIssue().getKey() : null)
                .assignee(issue.getAssignee() != null ? mapUserToSummaryDto(issue.getAssignee()) : null)
                .reporter(mapUserToSummaryDto(issue.getReporter()))
                .storyPoints(issue.getStoryPoints())
                .dueDate(issue.getDueDate())
                .estimateHours(issue.getEstimateHours())
                .loggedHours(issue.getLoggedHours())
                .commentCount(0L) // TODO: Count from comment repository
                .attachmentCount(0L) // TODO: Count from attachment repository
                .createdAt(issue.getCreatedAt())
                .updatedAt(issue.getUpdatedAt())
                .subtasks(null) // Explicitly null to prevent recursion
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
