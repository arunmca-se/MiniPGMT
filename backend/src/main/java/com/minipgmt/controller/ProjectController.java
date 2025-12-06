package com.minipgmt.controller;

import com.minipgmt.dto.ProjectDto;
import com.minipgmt.security.UserPrincipal;
import com.minipgmt.service.ProjectService;
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

/**
 * Project Controller
 * REST endpoints for project management
 */
@RestController
@RequestMapping("/api/projects")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Projects", description = "Project management endpoints")
@SecurityRequirement(name = "Bearer Authentication")
public class ProjectController {

    private final ProjectService projectService;

    /**
     * Get all projects
     */
    @GetMapping
    @Operation(summary = "Get all projects", description = "Retrieve all projects")
    public ResponseEntity<List<ProjectDto>> getAllProjects() {
        List<ProjectDto> projects = projectService.getAllProjects();
        return ResponseEntity.ok(projects);
    }

    /**
     * Get project by key
     */
    @GetMapping("/{key}")
    @Operation(summary = "Get project by key", description = "Retrieve project details by key")
    public ResponseEntity<ProjectDto> getProjectByKey(@PathVariable String key) {
        ProjectDto project = projectService.getProjectByKey(key);
        return ResponseEntity.ok(project);
    }

    /**
     * Get projects by current user
     */
    @GetMapping("/my-projects")
    @Operation(summary = "Get my projects", description = "Get projects where current user is a member")
    public ResponseEntity<List<ProjectDto>> getMyProjects(@AuthenticationPrincipal UserPrincipal currentUser) {
        List<ProjectDto> projects = projectService.getProjectsByUserId(currentUser.getId());
        return ResponseEntity.ok(projects);
    }

    /**
     * Create new project
     */
    @PostMapping
    @Operation(summary = "Create project", description = "Create a new project")
    public ResponseEntity<ProjectDto> createProject(
            @Valid @RequestBody ProjectDto projectDto,
            @AuthenticationPrincipal UserPrincipal currentUser
    ) {
        log.info("Creating project: {} by user: {}", projectDto.getKey(), currentUser.getEmail());
        ProjectDto created = projectService.createProject(projectDto, currentUser.getId());
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    /**
     * Update project
     */
    @PutMapping("/{key}")
    @Operation(summary = "Update project", description = "Update project details")
    public ResponseEntity<ProjectDto> updateProject(
            @PathVariable String key,
            @Valid @RequestBody ProjectDto projectDto
    ) {
        log.info("Updating project: {}", key);
        ProjectDto updated = projectService.updateProject(key, projectDto);
        return ResponseEntity.ok(updated);
    }

    /**
     * Delete project
     */
    @DeleteMapping("/{key}")
    @Operation(summary = "Delete project", description = "Delete a project")
    public ResponseEntity<Void> deleteProject(@PathVariable String key) {
        log.info("Deleting project: {}", key);
        projectService.deleteProject(key);
        return ResponseEntity.noContent().build();
    }
}
