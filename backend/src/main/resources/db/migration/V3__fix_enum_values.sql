-- Fix enum values to match Java enums
-- Change check constraints to use uppercase with underscores

-- Update projects table health check constraint
ALTER TABLE projects DROP CONSTRAINT IF EXISTS projects_health_check;
ALTER TABLE projects ADD CONSTRAINT projects_health_check CHECK (health IN ('ON_TRACK', 'AT_RISK', 'BEHIND'));

-- Update existing data
UPDATE projects SET health = 'ON_TRACK' WHERE health IN ('onTrack', 'on_track');
UPDATE projects SET health = 'AT_RISK' WHERE health IN ('atRisk', 'at_risk');
UPDATE projects SET health = 'BEHIND' WHERE health = 'behind';

-- Update workflow_statuses table category check constraint
ALTER TABLE workflow_statuses DROP CONSTRAINT IF EXISTS workflow_statuses_category_check;
ALTER TABLE workflow_statuses ADD CONSTRAINT workflow_statuses_category_check CHECK (category IN ('TODO', 'IN_PROGRESS', 'IN_REVIEW', 'DONE'));

-- Update existing data
UPDATE workflow_statuses SET category = 'TODO' WHERE category = 'todo';
UPDATE workflow_statuses SET category = 'IN_PROGRESS' WHERE category = 'inProgress';
UPDATE workflow_statuses SET category = 'IN_REVIEW' WHERE category = 'inReview';
UPDATE workflow_statuses SET category = 'DONE' WHERE category = 'done';

-- Update issues table status values to match workflow category values
UPDATE issues SET status = 'TODO' WHERE status = 'todo';
UPDATE issues SET status = 'IN_PROGRESS' WHERE status IN ('inProgress', 'in_progress');
UPDATE issues SET status = 'IN_REVIEW' WHERE status IN ('inReview', 'in_review');
UPDATE issues SET status = 'DONE' WHERE status = 'done';

-- Update sprint status constraint
ALTER TABLE sprints DROP CONSTRAINT IF EXISTS sprints_status_check;
ALTER TABLE sprints ADD CONSTRAINT sprints_status_check CHECK (status IN ('PLANNED', 'ACTIVE', 'COMPLETED', 'CANCELLED'));

-- Update existing data
UPDATE sprints SET status = 'PLANNED' WHERE status = 'planned';
UPDATE sprints SET status = 'ACTIVE' WHERE status = 'active';
UPDATE sprints SET status = 'COMPLETED' WHERE status = 'completed';
UPDATE sprints SET status = 'CANCELLED' WHERE status = 'cancelled';

-- Update issue type constraint
ALTER TABLE issues DROP CONSTRAINT IF EXISTS issues_type_check;
ALTER TABLE issues ADD CONSTRAINT issues_type_check CHECK (type IN ('EPIC', 'STORY', 'TASK', 'BUG', 'SUBTASK'));

-- Update existing data
UPDATE issues SET type = 'EPIC' WHERE type = 'epic';
UPDATE issues SET type = 'STORY' WHERE type = 'story';
UPDATE issues SET type = 'TASK' WHERE type = 'task';
UPDATE issues SET type = 'BUG' WHERE type = 'bug';
UPDATE issues SET type = 'SUBTASK' WHERE type = 'subtask';

-- Update issue priority constraint
ALTER TABLE issues DROP CONSTRAINT IF EXISTS issues_priority_check;
ALTER TABLE issues ADD CONSTRAINT issues_priority_check CHECK (priority IN ('LOWEST', 'LOW', 'MEDIUM', 'HIGH', 'HIGHEST'));

-- Update existing data
UPDATE issues SET priority = 'LOWEST' WHERE priority = 'lowest';
UPDATE issues SET priority = 'LOW' WHERE priority = 'low';
UPDATE issues SET priority = 'MEDIUM' WHERE priority = 'medium';
UPDATE issues SET priority = 'HIGH' WHERE priority = 'high';
UPDATE issues SET priority = 'HIGHEST' WHERE priority = 'highest';
