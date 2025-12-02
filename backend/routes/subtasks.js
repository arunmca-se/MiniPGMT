const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { db, calculateProjectProgress } = require('../database');
const router = express.Router();

// Create new subtask
router.post('/', (req, res) => {
  const {
    taskId,
    name,
    status = 'pending',
    assignee,
    notes
  } = req.body;

  if (!taskId || !name) {
    return res.status(400).json({ error: 'Task ID and name are required' });
  }

  const id = uuidv4();
  const query = `
    INSERT INTO subtasks (id, task_id, name, status, assignee, notes)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  db.run(
    query,
    [id, taskId, name, status, assignee, notes],
    function(err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      // Get project_id to recalculate progress
      db.get('SELECT project_id FROM tasks WHERE id = ?', [taskId], (err, row) => {
        if (err) {
          console.error('Error getting project_id:', err);
        } else if (row) {
          calculateProjectProgress(row.project_id, (err) => {
            if (err) console.error('Error calculating progress:', err);
          });
        }
      });

      const newSubtask = {
        id,
        name,
        status,
        assignee,
        notes
      };

      res.status(201).json(newSubtask);
    }
  );
});

// Update subtask (mainly for toggling completion)
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const {
    name,
    status,
    assignee,
    notes
  } = req.body;

  // Get task_id and project_id for progress recalculation
  const getTaskQuery = `
    SELECT t.project_id 
    FROM subtasks s 
    JOIN tasks t ON s.task_id = t.id 
    WHERE s.id = ?
  `;

  db.get(getTaskQuery, [id], (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    if (!row) {
      return res.status(404).json({ error: 'Subtask not found' });
    }

    const projectId = row.project_id;

    const query = `
      UPDATE subtasks 
      SET name = ?, status = ?, assignee = ?, notes = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `;

    db.run(
      query,
      [name, status, assignee, notes, id],
      function(err) {
        if (err) {
          return res.status(500).json({ error: err.message });
        }

        // Recalculate project progress
        calculateProjectProgress(projectId, (err) => {
          if (err) console.error('Error calculating progress:', err);
        });

        res.json({ message: 'Subtask updated successfully' });
      }
    );
  });
});

// Toggle subtask completion status
router.patch('/:id/toggle', (req, res) => {
  const { id } = req.params;

  // Get current status and project_id
  const getSubtaskQuery = `
    SELECT s.status, t.project_id 
    FROM subtasks s 
    JOIN tasks t ON s.task_id = t.id 
    WHERE s.id = ?
  `;

  db.get(getSubtaskQuery, [id], (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    if (!row) {
      return res.status(404).json({ error: 'Subtask not found' });
    }

    const newStatus = row.status === 'completed' ? 'pending' : 'completed';
    const projectId = row.project_id;

    const query = 'UPDATE subtasks SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?';

    db.run(query, [newStatus, id], function(err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      // Recalculate project progress
      calculateProjectProgress(projectId, (err) => {
        if (err) console.error('Error calculating progress:', err);
      });

      res.json({ 
        message: 'Subtask status updated successfully',
        newStatus 
      });
    });
  });
});

// Delete subtask
router.delete('/:id', (req, res) => {
  const { id } = req.params;

  // Get project_id for progress recalculation
  const getTaskQuery = `
    SELECT t.project_id 
    FROM subtasks s 
    JOIN tasks t ON s.task_id = t.id 
    WHERE s.id = ?
  `;

  db.get(getTaskQuery, [id], (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    if (!row) {
      return res.status(404).json({ error: 'Subtask not found' });
    }

    const projectId = row.project_id;

    db.run('DELETE FROM subtasks WHERE id = ?', [id], function(err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      // Recalculate project progress
      calculateProjectProgress(projectId, (err) => {
        if (err) console.error('Error calculating progress:', err);
      });

      res.json({ message: 'Subtask deleted successfully' });
    });
  });
});

module.exports = router;