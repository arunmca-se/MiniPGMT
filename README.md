# Appzcart Project Management Tool

A full-stack project management application built with React, TypeScript, Tailwind CSS, and SQLite.

## ✨ Features

### 🎯 Core Functionality
- **Project Dashboard** - Overview of all projects with stats and filtering
- **Project Detail View** - Hierarchical task and subtask management
- **Real-time Progress Tracking** - Automatic progress calculation based on subtask completion
- **Status Management** - Color-coded status badges for projects, tasks, and subtasks
- **Search & Filter** - Filter projects by status and search by name/description
- **HTML Export** - Generate downloadable project reports with embedded styling

### 🏗️ Project Hierarchy
```
Projects
├── Tasks
    └── Subtasks
```

### 📊 Status Types
- **Projects**: Not Started, In Progress, On Hold, Completed, Cancelled
- **Tasks**: To Do, In Progress, In Review, Blocked, Done
- **Subtasks**: Pending, Completed

## 🛠️ Tech Stack

### Frontend
- **React 19** + **TypeScript** - Modern React with full type safety
- **Tailwind CSS** - Utility-first styling
- **shadcn/ui** - Professional component library
- **Lucide React** - Beautiful icons

### Backend
- **Node.js** + **Express** - RESTful API server
- **SQLite** - Lightweight, file-based database
- **CORS** enabled for cross-origin requests

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager

### Installation
```bash
# Clone and install dependencies
git clone <repository-url>
cd MiniPGMT
npm run install:all
```

### Development
```bash
# Start both backend and frontend
npm run dev
```

This will start:
- **Backend API**: http://localhost:3001
- **Frontend**: http://localhost:5174

### Production Build
```bash
# Build frontend
npm run build

# Start backend in production
cd backend && npm start
```

## 📁 Project Structure

```
MiniPGMT/
├── backend/                 # Express.js backend
│   ├── routes/             # API routes
│   │   ├── projects.js     # Project CRUD operations
│   │   ├── tasks.js        # Task management
│   │   └── subtasks.js     # Subtask operations
│   ├── database.js         # SQLite database setup
│   ├── server.js          # Express server
│   └── projects.db        # SQLite database file
├── src/                    # React frontend
│   ├── components/        # React components
│   │   ├── ui/           # shadcn/ui components
│   │   ├── Dashboard.tsx
│   │   ├── ProjectCard.tsx
│   │   └── ProjectDetail.tsx
│   ├── services/         # API service layer
│   │   └── api.ts
│   ├── types/           # TypeScript interfaces
│   ├── utils/           # Utility functions
│   └── data/            # Sample data
└── README.md
```

## 🔗 API Endpoints

### Projects
- `GET /api/projects` - Get all projects with tasks and subtasks
- `POST /api/projects` - Create new project
- `GET /api/projects/:id` - Get specific project
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project

### Tasks
- `GET /api/tasks/project/:projectId` - Get tasks for project
- `POST /api/tasks` - Create new task
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task

### Subtasks
- `POST /api/subtasks` - Create new subtask
- `PUT /api/subtasks/:id` - Update subtask
- `PATCH /api/subtasks/:id/toggle` - Toggle completion status
- `DELETE /api/subtasks/:id` - Delete subtask

### Dashboard
- `GET /api/dashboard/stats` - Get dashboard statistics
- `GET /api/health` - Health check endpoint

## 💾 Database Schema

### Projects Table
```sql
CREATE TABLE projects (
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
);
```

### Tasks Table
```sql
CREATE TABLE tasks (
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
);
```

### Subtasks Table
```sql
CREATE TABLE subtasks (
  id TEXT PRIMARY KEY,
  task_id TEXT NOT NULL,
  name TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  assignee TEXT,
  notes TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (task_id) REFERENCES tasks (id) ON DELETE CASCADE
);
```

## 🎨 Features Demo

### Dashboard View
- Project cards with progress bars
- Real-time statistics (Total, In Progress, Completed, Overdue)
- Search and filtering capabilities
- Export functionality

### Project Detail View
- Expandable task accordion
- Interactive subtask checkboxes
- Progress tracking per task
- Team member display
- Due date warnings for overdue items

### Data Management
- Create/Read/Update/Delete operations for all entities
- Real-time progress calculation
- Automatic database updates
- Error handling with user feedback

## 📊 Sample Data

The application comes pre-loaded with realistic sample data:
- **4 Projects** (Healthplus App, E-commerce Dashboard, Website Redesign, CRM System)
- **8 Tasks** with various statuses and priorities
- **32 Subtasks** demonstrating the full hierarchy

## 🚀 Deployment

### Local SQLite (Development/Small Teams)
- Database file stored locally
- Perfect for development and small deployments

### Production Deployment Options
1. **Railway/Render**: Deploy both frontend and backend
2. **Vercel**: Frontend + separate backend deployment
3. **DigitalOcean/AWS**: Full server deployment

### Environment Variables
```bash
# backend/.env
NODE_ENV=development
PORT=3001
DB_PATH=./projects.db
```

## 🔧 Customization

### Adding New Status Types
1. Update TypeScript interfaces in `src/types/index.ts`
2. Add color mappings in `src/utils/calculations.ts`
3. Update database seed data if needed

### Extending API
1. Add new routes in `backend/routes/`
2. Update database schema if needed
3. Add corresponding frontend service methods

### UI Customization
- All components use Tailwind CSS
- shadcn/ui theme can be customized via CSS variables
- Add new components in `src/components/`

## 📄 License

This project is for demonstration purposes. Feel free to use and modify as needed.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

---

Built with ❤️ for Appzcart by Claude Code
