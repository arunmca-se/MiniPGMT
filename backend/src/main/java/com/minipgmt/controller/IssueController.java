package com.minipgmt.controller;

import com.minipgmt.dto.IssueDto;
import com.minipgmt.security.UserPrincipal;
import com.minipgmt.service.IssueService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

/**
 * Issue Controller
 * REST endpoints for issue management
 */
@RestController
@RequestMapping("/api/issues")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Issues", description = "Issue management endpoints")
@SecurityRequirement(name = "Bearer Authentication")
public class IssueController {

    private final IssueService issueService;

    /**
     * Get issues by project
     */
    @GetMapping
    @Operation(summary = "Get issues", description = "Get issues by project key")
    public ResponseEntity<List<IssueDto>> getIssuesByProject(@RequestParam String projectKey) {
        List<IssueDto> issues = issueService.getIssuesByProject(projectKey);
        return ResponseEntity.ok(issues);
    }

    /**
     * Get issue by key
     */
    @GetMapping("/{key}")
    @Operation(summary = "Get issue by key", description = "Retrieve issue details by key")
    public ResponseEntity<IssueDto> getIssueByKey(@PathVariable String key) {
        IssueDto issue = issueService.getIssueByKey(key);
        return ResponseEntity.ok(issue);
    }

    /**
     * Get issues assigned to current user
     */
    @GetMapping("/my-issues")
    @Operation(summary = "Get my issues", description = "Get issues assigned to current user")
    public ResponseEntity<List<IssueDto>> getMyIssues(@AuthenticationPrincipal UserPrincipal currentUser) {
        List<IssueDto> issues = issueService.getIssuesByAssignee(currentUser.getId());
        return ResponseEntity.ok(issues);
    }

    /**
     * Get issues by sprint
     */
    @GetMapping("/sprint/{sprintId}")
    @Operation(summary = "Get issues by sprint", description = "Get all issues in a sprint")
    public ResponseEntity<List<IssueDto>> getIssuesBySprint(@PathVariable UUID sprintId) {
        List<IssueDto> issues = issueService.getIssuesBySprint(sprintId);
        return ResponseEntity.ok(issues);
    }

    /**
     * Create new issue
     */
    @PostMapping
    @Operation(summary = "Create issue", description = "Create a new issue")
    public ResponseEntity<IssueDto> createIssue(
            @Valid @RequestBody IssueDto issueDto,
            @AuthenticationPrincipal UserPrincipal currentUser
    ) {
        log.info("Creating issue in project: {} by user: {}", issueDto.getProjectKey(), currentUser.getEmail());
        IssueDto created = issueService.createIssue(issueDto, currentUser.getId());
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    /**
     * Update issue
     */
    @PutMapping("/{key}")
    @Operation(summary = "Update issue", description = "Update issue details")
    public ResponseEntity<IssueDto> updateIssue(
            @PathVariable String key,
            @Valid @RequestBody IssueDto issueDto
    ) {
        log.info("Updating issue: {}", key);
        IssueDto updated = issueService.updateIssue(key, issueDto);
        return ResponseEntity.ok(updated);
    }

    /**
     * Delete issue
     */
    @DeleteMapping("/{key}")
    @Operation(summary = "Delete issue", description = "Delete an issue")
    public ResponseEntity<Void> deleteIssue(@PathVariable String key) {
        log.info("Deleting issue: {}", key);
        issueService.deleteIssue(key);
        return ResponseEntity.noContent().build();
    }

    /**
     * Get subtasks for an issue
     */
    @GetMapping("/{key}/subtasks")
    @Operation(summary = "Get subtasks", description = "Get all subtasks for a parent issue")
    public ResponseEntity<List<IssueDto>> getSubtasks(@PathVariable String key) {
        log.info("Getting subtasks for issue: {}", key);
        List<IssueDto> subtasks = issueService.getSubtasks(key);
        return ResponseEntity.ok(subtasks);
    }
}
