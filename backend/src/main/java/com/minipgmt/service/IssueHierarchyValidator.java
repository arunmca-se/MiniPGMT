package com.minipgmt.service;

import com.minipgmt.domain.Issue;
import com.minipgmt.domain.Issue.IssueType;
import com.minipgmt.exception.InvalidHierarchyException;
import com.minipgmt.repository.IssueRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.Set;
import java.util.UUID;

/**
 * Service for validating Jira-style issue hierarchy rules.
 * Implements standard Agile workflow constraints:
 * - Epic → Story/Task/Bug (no parent allowed)
 * - Story/Task/Bug → Subtask only
 * - Subtask → must have parent, no children allowed
 * - Maximum depth: 2 levels
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class IssueHierarchyValidator {

    private final IssueRepository issueRepository;

    /**
     * Validate if a parent-child relationship is allowed by Jira rules
     * @param childType Type of the child issue
     * @param parentType Type of the parent issue
     * @throws InvalidHierarchyException if relationship is invalid
     */
    public void validateParentChildRelationship(IssueType childType, IssueType parentType) {
        log.debug("Validating parent-child relationship: child={}, parent={}", childType, parentType);

        switch (parentType) {
            case EPIC:
                // Epic can only contain Story, Task, or Bug
                if (childType != IssueType.STORY && childType != IssueType.TASK && childType != IssueType.BUG) {
                    throw new InvalidHierarchyException(
                        "Epic can only contain Stories, Tasks, or Bugs"
                    );
                }
                break;

            case STORY:
                // Story can only contain Subtasks
                if (childType != IssueType.SUBTASK) {
                    throw new InvalidHierarchyException(
                        "Story can only contain Subtasks"
                    );
                }
                break;

            case TASK:
                // Task can only contain Subtasks
                if (childType != IssueType.SUBTASK) {
                    throw new InvalidHierarchyException(
                        "Task can only contain Subtasks"
                    );
                }
                break;

            case BUG:
                // Bug can only contain Subtasks
                if (childType != IssueType.SUBTASK) {
                    throw new InvalidHierarchyException(
                        "Bug can only contain Subtasks"
                    );
                }
                break;

            case SUBTASK:
                // Subtasks cannot have children
                throw new InvalidHierarchyException(
                    "Subtask cannot have children"
                );

            default:
                throw new InvalidHierarchyException(
                    "Unknown issue type: " + parentType
                );
        }

        log.debug("Parent-child relationship validated successfully");
    }

    /**
     * Check if circular reference would be created
     * @param issueId ID of the issue being updated
     * @param parentIssueId ID of the proposed parent
     * @throws InvalidHierarchyException if circular reference detected
     */
    public void validateCircularReference(UUID issueId, UUID parentIssueId) {
        log.debug("Validating circular reference: issue={}, parent={}", issueId, parentIssueId);

        if (issueId.equals(parentIssueId)) {
            throw new InvalidHierarchyException(
                "Cannot set an issue as its own parent"
            );
        }

        // Walk up the parent chain to ensure issueId is not in the ancestry
        Set<UUID> visited = new HashSet<>();
        UUID currentParentId = parentIssueId;

        while (currentParentId != null) {
            if (currentParentId.equals(issueId)) {
                throw new InvalidHierarchyException(
                    "Cannot create circular parent-child relationship"
                );
            }

            if (visited.contains(currentParentId)) {
                // Circular reference in existing data (shouldn't happen but handle it)
                log.error("Detected circular reference in existing data: {}", currentParentId);
                throw new InvalidHierarchyException(
                    "Circular reference detected in parent chain"
                );
            }

            visited.add(currentParentId);

            // Get the parent's parent
            Issue parent = issueRepository.findById(currentParentId).orElse(null);
            if (parent == null) {
                break;
            }

            currentParentId = parent.getParentIssue() != null ? parent.getParentIssue().getId() : null;
        }

        log.debug("No circular reference detected");
    }

    /**
     * Check if an issue type can have a parent
     * @param type Issue type to check
     * @return true if type can have a parent, false otherwise
     */
    public boolean canHaveParent(IssueType type) {
        // Only Epic cannot have a parent
        return type != IssueType.EPIC;
    }

    /**
     * Check if an issue type can have children
     * @param type Issue type to check
     * @return true if type can have children, false otherwise
     */
    public boolean canHaveChildren(IssueType type) {
        // Only Subtask cannot have children
        return type != IssueType.SUBTASK;
    }

    /**
     * Get valid parent types for a given child type
     * @param childType Type of the child issue
     * @return Set of allowed parent types
     */
    public Set<IssueType> getValidParentTypes(IssueType childType) {
        Set<IssueType> validParents = new HashSet<>();

        switch (childType) {
            case EPIC:
                // Epic cannot have a parent
                break;

            case STORY:
            case TASK:
                // Story and Task can have Epic as parent (optional)
                validParents.add(IssueType.EPIC);
                break;

            case BUG:
                // Bug can have Epic or Story as parent (optional)
                validParents.add(IssueType.EPIC);
                validParents.add(IssueType.STORY);
                break;

            case SUBTASK:
                // Subtask can have Story, Task, or Bug as parent (required)
                validParents.add(IssueType.STORY);
                validParents.add(IssueType.TASK);
                validParents.add(IssueType.BUG);
                break;

            default:
                log.warn("Unknown issue type: {}", childType);
                break;
        }

        return validParents;
    }

    /**
     * Validate hierarchy depth (max 2 levels: Epic → Story → Subtask)
     * @param parentIssueId ID of the parent issue
     * @throws InvalidHierarchyException if depth would be exceeded
     */
    public void validateHierarchyDepth(UUID parentIssueId) {
        log.debug("Validating hierarchy depth for parent: {}", parentIssueId);

        Issue parent = issueRepository.findById(parentIssueId)
                .orElseThrow(() -> new InvalidHierarchyException("Parent issue not found"));

        // If parent already has a parent, adding a child would create 3 levels
        if (parent.getParentIssue() != null) {
            throw new InvalidHierarchyException(
                "Maximum hierarchy depth exceeded (2 levels allowed: Epic → Story → Subtask)"
            );
        }

        log.debug("Hierarchy depth validated successfully");
    }

    /**
     * Validate that Subtask has a parent
     * @param issueType Type of the issue
     * @param parentIssueId ID of the parent (can be null)
     * @throws InvalidHierarchyException if Subtask has no parent
     */
    public void validateSubtaskRequiresParent(IssueType issueType, UUID parentIssueId) {
        if (issueType == IssueType.SUBTASK && parentIssueId == null) {
            throw new InvalidHierarchyException(
                "Subtasks must have a parent issue"
            );
        }
    }

    /**
     * Validate that Epic cannot have a parent
     * @param issueType Type of the issue
     * @param parentIssueId ID of the parent (can be null)
     * @throws InvalidHierarchyException if Epic has a parent
     */
    public void validateEpicCannotHaveParent(IssueType issueType, UUID parentIssueId) {
        if (issueType == IssueType.EPIC && parentIssueId != null) {
            throw new InvalidHierarchyException(
                "Epic cannot have a parent issue"
            );
        }
    }
}
