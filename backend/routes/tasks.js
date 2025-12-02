const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { db, calculateProjectProgress } = require('../database');
const router = express.Router();

// Get all tasks for a project
router.get('/project/:projectId', (req, res) => {
  const { projectId } = req.params;
  
  const query = `
    SELECT 
      t.*,
      s.id as subtask_id,
      s.name as subtask_name,
      s.status as subtask_status,
      s.assignee as subtask_assignee,
      s.notes as subtask_notes
    FROM tasks t
    LEFT JOIN subtasks s ON t.id = s.task_id
    WHERE t.project_id = ?
    ORDER BY t.created_at ASC, s.created_at ASC
  `;

  db.all(query, [projectId], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    // Group tasks with their subtasks
    const tasksMap = new Map();

    rows.forEach(row => {
      if (!tasksMap.has(row.id)) {
        tasksMap.set(row.id, {
          id: row.id,
          name: row.name,
          description: row.description,
          status: row.status,
          priority: row.priority,
          assignee: row.assignee,
          dueDate: row.due_date,
          estimatedHours: row.estimated_hours,
          subtasks: []
        });
      }

      const task = tasksMap.get(row.id);

      // Add subtask if exists
      if (row.subtask_id && !task.subtasks.find(s => s.id === row.subtask_id)) {
        task.subtasks.push({
          id: row.subtask_id,
          name: row.subtask_name,
          status: row.subtask_status,
          assignee: row.subtask_assignee,
          notes: row.subtask_notes
        });
      }
    });

    const tasks = Array.from(tasksMap.values());
    res.json(tasks);
  });
});

// Create new task
router.post('/', (req, res) => {
  const {
    projectId,
    name,
    description,
    status = 'to-do',
    priority = 'medium',
    assignee,
    dueDate,
    estimatedHours
  } = req.body;

  if (!projectId || !name) {
    return res.status(400).json({ error: 'Project ID and name are required' });
  }

  const id = uuidv4();
  const query = `
    INSERT INTO tasks (id, project_id, name, description, status, priority, assignee, due_date, estimated_hours)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.run(
    query,
    [id, projectId, name, description, status, priority, assignee, dueDate, estimatedHours],
    function(err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      // Recalculate project progress
      calculateProjectProgress(projectId, (err) => {
        if (err) console.error('Error calculating progress:', err);
      });

      const newTask = {
        id,
        name,
        description,
        status,
        priority,
        assignee,
        dueDate,
        estimatedHours,
        subtasks: []
      };

      res.status(201).json(newTask);
    }
  );
});

// Update task
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const {
    name,
    description,
    status,
    priority,
    assignee,
    dueDate,
    estimatedHours
  } = req.body;

  // First get the project_id for progress recalculation
  db.get('SELECT project_id FROM tasks WHERE id = ?', [id], (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    if (!row) {
      return res.status(404).json({ error: 'Task not found' });
    }

    const projectId = row.project_id;

    const query = `
      UPDATE tasks 
      SET name = ?, description = ?, status = ?, priority = ?, 
          assignee = ?, due_date = ?, estimated_hours = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `;

    db.run(
      query,
      [name, description, status, priority, assignee, dueDate, estimatedHours, id],
      function(err) {
        if (err) {
          return res.status(500).json({ error: err.message });
        }

        // Recalculate project progress
        calculateProjectProgress(projectId, (err) => {
          if (err) console.error('Error calculating progress:', err);
        });

        res.json({ message: 'Task updated successfully' });
      }
    );
  });
});

// Delete task
router.delete('/:id', (req, res) => {
  const { id } = req.params;

  // First get the project_id for progress recalculation
  db.get('SELECT project_id FROM tasks WHERE id = ?', [id], (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    if (!row) {
      return res.status(404).json({ error: 'Task not found' });
    }

    const projectId = row.project_id;

    db.run('DELETE FROM tasks WHERE id = ?', [id], function(err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      // Recalculate project progress
      calculateProjectProgress(projectId, (err) => {
        if (err) console.error('Error calculating progress:', err);
      });

      res.json({ message: 'Task deleted successfully' });
    });
  });
});

module.exports = router;