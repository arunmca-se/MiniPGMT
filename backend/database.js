const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'projects.db');

// Create and initialize database
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('Connected to SQLite database');
  }
});

// Promisify database operations
const dbRun = (query, params = []) => {
  return new Promise((resolve, reject) => {
    db.run(query, params, function(err) {
      if (err) reject(err);
      else resolve({ lastID: this.lastID, changes: this.changes });
    });
  });
};

const dbGet = (query, params = []) => {
  return new Promise((resolve, reject) => {
    db.get(query, params, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
};

const dbAll = (query, params = []) => {
  return new Promise((resolve, reject) => {
    db.all(query, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
};

// Create tables
const initDatabase = () => {
  // Database metadata table to track initialization
  db.run(`
    CREATE TABLE IF NOT EXISTS database_metadata (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Projects table
  db.run(`
    CREATE TABLE IF NOT EXISTS projects (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      description TEXT,
      status TEXT NOT NULL DEFAULT 'not-started',
      priority TEXT NOT NULL DEFAULT 'medium',
      start_date TEXT NOT NULL,
      due_date TEXT NOT NULL,
      progress INTEGER DEFAULT 0,
      team_members TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Tasks table
  db.run(`
    CREATE TABLE IF NOT EXISTS tasks (
      id TEXT PRIMARY KEY,
      project_id TEXT NOT NULL,
      name TEXT NOT NULL,
      description TEXT,
      status TEXT NOT NULL DEFAULT 'to-do',
      priority TEXT NOT NULL DEFAULT 'medium',
      assignee TEXT,
      due_date TEXT,
      estimated_hours INTEGER,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (project_id) REFERENCES projects (id) ON DELETE CASCADE
    )
  `);

  // Subtasks table
  db.run(`
    CREATE TABLE IF NOT EXISTS subtasks (
      id TEXT PRIMARY KEY,
      task_id TEXT NOT NULL,
      name TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'pending',
      assignee TEXT,
      notes TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (task_id) REFERENCES tasks (id) ON DELETE CASCADE
    )
  `);

  console.log('Database tables initialized');
};

// Calculate project progress based on subtasks
const calculateProjectProgress = async (projectId) => {
  const query = `
    SELECT
      COUNT(*) as total_subtasks,
      COUNT(CASE WHEN s.status = 'completed' THEN 1 END) as completed_subtasks
    FROM tasks t
    LEFT JOIN subtasks s ON t.id = s.task_id
    WHERE t.project_id = ?
  `;

  const row = await dbGet(query, [projectId]);

  const progress = row.total_subtasks > 0
    ? Math.round((row.completed_subtasks / row.total_subtasks) * 100)
    : 0;

  // Update project progress
  await dbRun(
    'UPDATE projects SET progress = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
    [progress, projectId]
  );

  return progress;
};

// Seed database with sample data
const seedDatabase = () => {
  // Check if database has been previously initialized
  db.get('SELECT value FROM database_metadata WHERE key = ?', ['initial_seed_completed'], (err, row) => {
    if (err) {
      console.error('Error checking database metadata:', err);
      return;
    }

    if (row && row.value === 'true') {
      console.log('Database has already been seeded. Skipping auto-seed to preserve user data.');
      return;
    }

    console.log('First-time database initialization. Seeding with sample data...');

    // Sample projects
    const projects = [
      {
        id: 'proj-1',
        name: 'Healthplus Mobile App',
        description: 'Main health management application for tracking medical records and appointments',
        status: 'in-progress',
        priority: 'high',
        start_date: '2025-01-15',
        due_date: '2025-06-30',
        team_members: JSON.stringify(['John Doe', 'Sarah Wilson', 'Mike Chen'])
      },
      {
        id: 'proj-2',
        name: 'E-commerce Dashboard',
        description: 'Admin dashboard for managing products, orders, and customer data',
        status: 'in-progress',
        priority: 'high',
        start_date: '2025-02-01',
        due_date: '2025-05-15',
        team_members: JSON.stringify(['Alex Thompson', 'Lisa Park'])
      },
      {
        id: 'proj-3',
        name: 'Company Website Redesign',
        description: 'Modern responsive website with updated branding and improved UX',
        status: 'completed',
        priority: 'medium',
        start_date: '2024-11-01',
        due_date: '2024-12-31',
        team_members: JSON.stringify(['Emma Rodriguez', 'David Kim'])
      },
      {
        id: 'proj-4',
        name: 'Internal CRM System',
        description: 'Customer relationship management system for sales team',
        status: 'on-hold',
        priority: 'low',
        start_date: '2025-03-01',
        due_date: '2025-08-31',
        team_members: JSON.stringify(['Robert Chang'])
      }
    ];

    // Sample tasks
    const tasks = [
      {
        id: 'task-1',
        project_id: 'proj-1',
        name: 'User Authentication Module',
        description: 'Implement login, signup, OTP verification and password reset functionality',
        status: 'done',
        priority: 'high',
        assignee: 'John Doe',
        due_date: '2025-02-15',
        estimated_hours: 40
      },
      {
        id: 'task-2',
        project_id: 'proj-1',
        name: 'Health Document Upload',
        description: 'Allow users to upload and organize health documents with categorization',
        status: 'in-progress',
        priority: 'medium',
        assignee: 'Sarah Wilson',
        due_date: '2025-03-01',
        estimated_hours: 32
      },
      {
        id: 'task-3',
        project_id: 'proj-1',
        name: 'Appointment Scheduling',
        description: 'Calendar integration and appointment management system',
        status: 'to-do',
        priority: 'medium',
        assignee: 'Mike Chen',
        due_date: '2025-04-15',
        estimated_hours: 48
      },
      {
        id: 'task-4',
        project_id: 'proj-2',
        name: 'Product Management System',
        description: 'CRUD operations for products with inventory tracking',
        status: 'in-progress',
        priority: 'high',
        assignee: 'Alex Thompson',
        due_date: '2025-03-15',
        estimated_hours: 56
      },
      {
        id: 'task-5',
        project_id: 'proj-2',
        name: 'Order Management',
        description: 'Order tracking and fulfillment workflow',
        status: 'to-do',
        priority: 'medium',
        assignee: 'Lisa Park',
        due_date: '2025-04-01',
        estimated_hours: 40
      },
      {
        id: 'task-6',
        project_id: 'proj-3',
        name: 'UI/UX Design',
        description: 'New design system and user interface mockups',
        status: 'done',
        priority: 'high',
        assignee: 'Emma Rodriguez',
        due_date: '2024-11-30',
        estimated_hours: 60
      },
      {
        id: 'task-7',
        project_id: 'proj-3',
        name: 'Frontend Development',
        description: 'Implementation of the new design with modern frameworks',
        status: 'done',
        priority: 'high',
        assignee: 'David Kim',
        due_date: '2024-12-20',
        estimated_hours: 80
      },
      {
        id: 'task-8',
        project_id: 'proj-4',
        name: 'Requirements Analysis',
        description: 'Gather requirements from stakeholders and create specifications',
        status: 'in-review',
        priority: 'high',
        assignee: 'Robert Chang',
        due_date: '2025-03-15',
        estimated_hours: 24
      }
    ];

    // Sample subtasks
    const subtasks = [
      // Task 1 subtasks (all completed)
      { id: 'sub-1', task_id: 'task-1', name: 'Login UI Design', status: 'completed' },
      { id: 'sub-2', task_id: 'task-1', name: 'API Integration', status: 'completed' },
      { id: 'sub-3', task_id: 'task-1', name: 'OTP Flow Implementation', status: 'completed' },
      { id: 'sub-4', task_id: 'task-1', name: 'Password Reset Flow', status: 'completed' },
      
      // Task 2 subtasks (mixed)
      { id: 'sub-5', task_id: 'task-2', name: 'File picker component', status: 'completed' },
      { id: 'sub-6', task_id: 'task-2', name: 'Cloud storage integration', status: 'pending' },
      { id: 'sub-7', task_id: 'task-2', name: 'Document categorization', status: 'pending' },
      { id: 'sub-8', task_id: 'task-2', name: 'Preview functionality', status: 'pending' },
      
      // Task 3 subtasks (all pending)
      { id: 'sub-9', task_id: 'task-3', name: 'Calendar component', status: 'pending' },
      { id: 'sub-10', task_id: 'task-3', name: 'Doctor availability API', status: 'pending' },
      { id: 'sub-11', task_id: 'task-3', name: 'Booking confirmation', status: 'pending' },
      { id: 'sub-12', task_id: 'task-3', name: 'Reminder notifications', status: 'pending' },
      
      // Other tasks subtasks
      { id: 'sub-13', task_id: 'task-4', name: 'Product listing page', status: 'completed' },
      { id: 'sub-14', task_id: 'task-4', name: 'Add/Edit product forms', status: 'pending' },
      { id: 'sub-15', task_id: 'task-4', name: 'Image upload functionality', status: 'pending' },
      { id: 'sub-16', task_id: 'task-4', name: 'Inventory management', status: 'pending' },
      
      { id: 'sub-17', task_id: 'task-5', name: 'Order listing and filters', status: 'pending' },
      { id: 'sub-18', task_id: 'task-5', name: 'Order status updates', status: 'pending' },
      { id: 'sub-19', task_id: 'task-5', name: 'Shipping integration', status: 'pending' },
      { id: 'sub-20', task_id: 'task-5', name: 'Customer notifications', status: 'pending' },
      
      // Completed project subtasks
      { id: 'sub-21', task_id: 'task-6', name: 'Wireframes and mockups', status: 'completed' },
      { id: 'sub-22', task_id: 'task-6', name: 'Design system creation', status: 'completed' },
      { id: 'sub-23', task_id: 'task-6', name: 'Responsive layouts', status: 'completed' },
      { id: 'sub-24', task_id: 'task-6', name: 'Interactive prototypes', status: 'completed' },
      
      { id: 'sub-25', task_id: 'task-7', name: 'Homepage implementation', status: 'completed' },
      { id: 'sub-26', task_id: 'task-7', name: 'About page development', status: 'completed' },
      { id: 'sub-27', task_id: 'task-7', name: 'Contact form integration', status: 'completed' },
      { id: 'sub-28', task_id: 'task-7', name: 'Performance optimization', status: 'completed' },
      
      { id: 'sub-29', task_id: 'task-8', name: 'Stakeholder interviews', status: 'completed' },
      { id: 'sub-30', task_id: 'task-8', name: 'Feature specification', status: 'pending' },
      { id: 'sub-31', task_id: 'task-8', name: 'Technical architecture', status: 'pending' },
      { id: 'sub-32', task_id: 'task-8', name: 'Timeline planning', status: 'pending' }
    ];

    // Insert data
    const insertProject = db.prepare(`
      INSERT INTO projects (id, name, description, status, priority, start_date, due_date, team_members)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const insertTask = db.prepare(`
      INSERT INTO tasks (id, project_id, name, description, status, priority, assignee, due_date, estimated_hours)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const insertSubtask = db.prepare(`
      INSERT INTO subtasks (id, task_id, name, status)
      VALUES (?, ?, ?, ?)
    `);

    projects.forEach(project => {
      insertProject.run(
        project.id, project.name, project.description, project.status,
        project.priority, project.start_date, project.due_date, project.team_members
      );
    });

    tasks.forEach(task => {
      insertTask.run(
        task.id, task.project_id, task.name, task.description, task.status,
        task.priority, task.assignee, task.due_date, task.estimated_hours
      );
    });

    subtasks.forEach(subtask => {
      insertSubtask.run(subtask.id, subtask.task_id, subtask.name, subtask.status);
    });

    insertProject.finalize();
    insertTask.finalize();
    insertSubtask.finalize();

    // Calculate initial progress for all projects
    Promise.all(
      projects.map(project => calculateProjectProgress(project.id))
    ).catch(err => console.error('Error calculating progress:', err));

    // Mark database as seeded
    db.run(
      'INSERT OR REPLACE INTO database_metadata (key, value) VALUES (?, ?)',
      ['initial_seed_completed', 'true'],
      (err) => {
        if (err) {
          console.error('Error marking database as seeded:', err);
        } else {
          console.log('Sample data inserted successfully and database marked as initialized');
        }
      }
    );
  });
};

module.exports = {
  db,
  dbRun,
  dbGet,
  dbAll,
  initDatabase,
  seedDatabase,
  calculateProjectProgress
};