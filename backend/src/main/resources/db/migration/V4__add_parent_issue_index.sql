-- V4: Add index on parent_issue_id for performance optimization
-- This migration adds a database index to improve query performance
-- when fetching subtasks by parent issue ID.

-- Create index on parent_issue_id column in issues table
-- This improves performance of hierarchical queries
CREATE INDEX IF NOT EXISTS idx_issues_parent_issue_id ON issues(parent_issue_id);

-- Add comment to document the purpose
COMMENT ON INDEX idx_issues_parent_issue_id IS 'Index for optimizing subtask queries by parent issue ID';
