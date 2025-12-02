const express = require('express');
const cors = require('cors');
const { initDatabase, seedDatabase } = require('./database');

// Import routes
const projectsRouter = require('./routes/projects');
const tasksRouter = require('./routes/tasks');
const subtasksRouter = require('./routes/subtasks');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175', 'http://localhost:5176'],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  console.log('Headers:', req.headers);
  next();
});

// Routes
app.use('/api/projects', projectsRouter);
app.use('/api/tasks', tasksRouter);
app.use('/api/subtasks', subtasksRouter);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Appzcart Project Management API is running',
    timestamp: new Date().toISOString()
  });
});

// Dashboard stats endpoint
app.get('/api/dashboard/stats', (req, res) => {
  const query = `
    SELECT 
      COUNT(*) as total_projects,
      COUNT(CASE WHEN status = 'in-progress' THEN 1 END) as in_progress,
      COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed,
      COUNT(CASE WHEN status != 'completed' AND date(due_date) < date('now') THEN 1 END) as overdue
    FROM projects
  `;

  const { db } = require('./database');
  
  db.get(query, [], (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    res.json({
      totalProjects: row.total_projects,
      inProgress: row.in_progress,
      completed: row.completed,
      overdue: row.overdue
    });
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ 
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'API endpoint not found' });
});

// Initialize database and start server
const startServer = async () => {
  try {
    // Initialize database tables
    initDatabase();
    
    // Seed with sample data after a short delay to ensure tables are created
    setTimeout(() => {
      seedDatabase();
    }, 1000);

    // Start server
    app.listen(PORT, () => {
      console.log(`🚀 Appzcart Project Management API running on port ${PORT}`);
      console.log(`📊 Dashboard: http://localhost:${PORT}/api/health`);
      console.log(`📁 Projects API: http://localhost:${PORT}/api/projects`);
      console.log('');
      console.log('Available endpoints:');
      console.log('  GET    /api/health              - Health check');
      console.log('  GET    /api/dashboard/stats     - Dashboard statistics');
      console.log('  GET    /api/projects            - Get all projects');
      console.log('  POST   /api/projects            - Create project');
      console.log('  GET    /api/projects/:id        - Get project by ID');
      console.log('  PUT    /api/projects/:id        - Update project');
      console.log('  DELETE /api/projects/:id        - Delete project');
      console.log('  GET    /api/tasks/project/:id   - Get tasks for project');
      console.log('  POST   /api/tasks               - Create task');
      console.log('  PUT    /api/tasks/:id           - Update task');
      console.log('  DELETE /api/tasks/:id           - Delete task');
      console.log('  POST   /api/subtasks            - Create subtask');
      console.log('  PUT    /api/subtasks/:id        - Update subtask');
      console.log('  PATCH  /api/subtasks/:id/toggle - Toggle subtask status');
      console.log('  DELETE /api/subtasks/:id        - Delete subtask');
      console.log('');
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down server...');
  const { db } = require('./database');
  db.close((err) => {
    if (err) {
      console.error('Error closing database:', err);
    } else {
      console.log('Database connection closed');
    }
    process.exit(0);
  });
});

startServer();