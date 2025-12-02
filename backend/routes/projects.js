const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { db, dbRun, dbGet, dbAll, calculateProjectProgress } = require('../database');
const router = express.Router();

// Get all projects with their tasks and subtasks
router.get('/', async (req, res) => {
  try {
    const query = `
      SELECT
        p.*,
        t.id as task_id,
        t.name as task_name,
        t.description as task_description,
        t.status as task_status,
        t.priority as task_priority,
        t.assignee as task_assignee,
        t.due_date as task_due_date,
        t.estimated_hours as task_estimated_hours,
        s.id as subtask_id,
        s.name as subtask_name,
        s.status as subtask_status,
        s.assignee as subtask_assignee,
        s.notes as subtask_notes
      FROM projects p
      LEFT JOIN tasks t ON p.id = t.project_id
      LEFT JOIN subtasks s ON t.id = s.task_id
      ORDER BY p.created_at DESC, t.created_at ASC, s.created_at ASC
    `;

    const rows = await dbAll(query, []);

    // Group the results into nested structure
    const projectsMap = new Map();

    rows.forEach(row => {
      // Get or create project
      if (!projectsMap.has(row.id)) {
        projectsMap.set(row.id, {
          id: row.id,
          name: row.name,
          description: row.description,
          status: row.status,
          priority: row.priority,
          startDate: row.start_date,
          dueDate: row.due_date,
          progress: row.progress,
          teamMembers: row.team_members ? JSON.parse(row.team_members) : [],
          tasks: new Map()
        });
      }

      const project = projectsMap.get(row.id);

      // Add task if exists
      if (row.task_id && !project.tasks.has(row.task_id)) {
        project.tasks.set(row.task_id, {
          id: row.task_id,
          name: row.task_name,
          description: row.task_description,
          status: row.task_status,
          priority: row.task_priority,
          assignee: row.task_assignee,
          dueDate: row.task_due_date,
          estimatedHours: row.task_estimated_hours,
          subtasks: []
        });
      }

      // Add subtask if exists
      if (row.subtask_id && project.tasks.has(row.task_id)) {
        const task = project.tasks.get(row.task_id);
        if (!task.subtasks.find(s => s.id === row.subtask_id)) {
          task.subtasks.push({
            id: row.subtask_id,
            name: row.subtask_name,
            status: row.subtask_status,
            assignee: row.subtask_assignee,
            notes: row.subtask_notes
          });
        }
      }
    });

    // Convert maps to arrays
    const projects = Array.from(projectsMap.values()).map(project => ({
      ...project,
      tasks: Array.from(project.tasks.values())
    }));

    res.json(projects);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single project by ID
router.get('/:id', (req, res) => {
  const { id } = req.params;
  
  const query = `
    SELECT 
      p.*,
      t.id as task_id,
      t.name as task_name,
      t.description as task_description,
      t.status as task_status,
      t.priority as task_priority,
      t.assignee as task_assignee,
      t.due_date as task_due_date,
      t.estimated_hours as task_estimated_hours,
      s.id as subtask_id,
      s.name as subtask_name,
      s.status as subtask_status,
      s.assignee as subtask_assignee,
      s.notes as subtask_notes
    FROM projects p
    LEFT JOIN tasks t ON p.id = t.project_id
    LEFT JOIN subtasks s ON t.id = s.task_id
    WHERE p.id = ?
    ORDER BY t.created_at ASC, s.created_at ASC
  `;

  db.all(query, [id], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Project not found' });
    }

    // Build project object
    const project = {
      id: rows[0].id,
      name: rows[0].name,
      description: rows[0].description,
      status: rows[0].status,
      priority: rows[0].priority,
      startDate: rows[0].start_date,
      dueDate: rows[0].due_date,
      progress: rows[0].progress,
      teamMembers: rows[0].team_members ? JSON.parse(rows[0].team_members) : [],
      tasks: new Map()
    };

    rows.forEach(row => {
      // Add task if exists
      if (row.task_id && !project.tasks.has(row.task_id)) {
        project.tasks.set(row.task_id, {
          id: row.task_id,
          name: row.task_name,
          description: row.task_description,
          status: row.task_status,
          priority: row.task_priority,
          assignee: row.task_assignee,
          dueDate: row.task_due_date,
          estimatedHours: row.task_estimated_hours,
          subtasks: []
        });
      }

      // Add subtask if exists
      if (row.subtask_id && project.tasks.has(row.task_id)) {
        const task = project.tasks.get(row.task_id);
        if (!task.subtasks.find(s => s.id === row.subtask_id)) {
          task.subtasks.push({
            id: row.subtask_id,
            name: row.subtask_name,
            status: row.subtask_status,
            assignee: row.subtask_assignee,
            notes: row.subtask_notes
          });
        }
      }
    });

    // Convert tasks map to array
    project.tasks = Array.from(project.tasks.values());

    res.json(project);
  });
});

// Create new project
router.post('/', (req, res) => {
  const {
    name,
    description,
    status = 'not-started',
    priority = 'medium',
    startDate,
    dueDate,
    teamMembers = []
  } = req.body;

  if (!name || !startDate || !dueDate) {
    return res.status(400).json({ error: 'Name, start date, and due date are required' });
  }

  const id = uuidv4();
  const query = `
    INSERT INTO projects (id, name, description, status, priority, start_date, due_date, team_members)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.run(
    query,
    [id, name, description, status, priority, startDate, dueDate, JSON.stringify(teamMembers)],
    function(err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      // Return the created project
      const newProject = {
        id,
        name,
        description,
        status,
        priority,
        startDate,
        dueDate,
        progress: 0,
        teamMembers,
        tasks: []
      };

      res.status(201).json(newProject);
    }
  );
});

// Update project
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const {
    name,
    description,
    status,
    priority,
    startDate,
    dueDate,
    teamMembers
  } = req.body;

  const query = `
    UPDATE projects 
    SET name = ?, description = ?, status = ?, priority = ?, 
        start_date = ?, due_date = ?, team_members = ?, updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `;

  db.run(
    query,
    [name, description, status, priority, startDate, dueDate, JSON.stringify(teamMembers), id],
    function(err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      if (this.changes === 0) {
        return res.status(404).json({ error: 'Project not found' });
      }

      res.json({ message: 'Project updated successfully' });
    }
  );
});

// Delete project
router.delete('/:id', (req, res) => {
  const { id } = req.params;

  db.run('DELETE FROM projects WHERE id = ?', [id], function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    if (this.changes === 0) {
      return res.status(404).json({ error: 'Project not found' });
    }

    res.json({ message: 'Project deleted successfully' });
  });
});

module.exports = router;