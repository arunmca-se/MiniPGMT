package com.minipgmt.exception;

/**
 * Exception thrown when an invalid issue hierarchy operation is attempted.
 * This exception is used to enforce Jira-style Agile workflow rules such as:
 * - Epic cannot have a parent
 * - Subtask must have a parent
 * - Story/Task/Bug can only contain Subtasks
 * - Maximum hierarchy depth of 2 levels
 * - Circular reference prevention
 */
public class InvalidHierarchyException extends RuntimeException {

    public InvalidHierarchyException(String message) {
        super(message);
    }

    public InvalidHierarchyException(String message, Throwable cause) {
        super(message, cause);
    }
}
