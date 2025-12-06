# MiniPGMT - Professional Project Management Tool

A modern, full-stack project management application inspired by Jira, built with React/TypeScript frontend and Java Spring Boot backend.

## 🎯 Features

- **Dashboard** - Real-time project health, team workload, and critical issues
- **Kanban Board** - Drag-and-drop task management with status workflows
- **Sprint Management** - Plan and track sprints with burndown charts
- **Real-time Updates** - WebSocket-powered live collaboration
- **Time Tracking** - Log and track work hours
- **Team Management** - Manage members and view workload distribution
- **Reports & Analytics** - Velocity, cumulative flow, cycle time metrics
- **Professional UI/UX** - Design-system-first approach with consistent styling

## 🛠️ Tech Stack

### Frontend
- React 18+ with TypeScript
- TailwindCSS + Shadcn UI
- TanStack Query (React Query)
- Zustand for state management
- React Router
- WebSocket (STOMP)
- Recharts for data visualization

### Backend
- Java 17 + Spring Boot 3.x
- Spring Security + JWT
- Spring Data JPA + PostgreSQL
- Spring WebSocket
- Redis for caching
- Flyway for database migrations

### Infrastructure
- Docker & Docker Compose
- PostgreSQL 15
- Redis 7

## 🚀 Quick Start

### Prerequisites

- Docker Desktop installed
- Java 17+ (for backend development)
- Node.js 18+ (for frontend development)
- Maven 3.9+ (or use wrapper)

### 1. Start Database Services

```bash
# Start PostgreSQL and Redis
docker-compose up -d postgres redis

# Verify services are running
docker-compose ps

# View logs
docker-compose logs -f postgres
```

### 2. Backend Setup

```bash
cd backend

# Build the project
./mvnw clean install

# Run database migrations
./mvnw flyway:migrate

# Start the backend server
./mvnw spring-boot:run

# Backend will be available at: http://localhost:8080
# API docs (Swagger): http://localhost:8080/swagger-ui.html
```

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev

# Frontend will be available at: http://localhost:5173
```

## 📁 Project Structure

```
MiniPGMT/
├── backend/                    # Spring Boot backend
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/projectmgmt/
│   │   │   │   ├── config/     # Security, WebSocket, etc.
│   │   │   │   ├── domain/     # Entities
│   │   │   │   ├── repository/ # Data access
│   │   │   │   ├── service/    # Business logic
│   │   │   │   ├── controller/ # REST endpoints
│   │   │   │   ├── dto/        # Data transfer objects
│   │   │   │   └── security/   # JWT, auth
│   │   │   └── resources/
│   │   │       ├── application.yml
│   │   │       └── db/migration/  # Flyway migrations
│   │   └── test/
│   ├── pom.xml
│   └── Dockerfile
│
├── frontend/                   # React frontend
│   ├── src/
│   │   ├── design-system/      # Design tokens & primitives
│   │   │   ├── tokens/         # Colors, spacing, typography
│   │   │   ├── primitives/     # Button, Input, Badge, etc.
│   │   │   └── patterns/       # DataTable, etc.
│   │   ├── components/
│   │   │   ├── layout/         # AppShell, Sidebar, TopNav
│   │   │   └── features/       # Dashboard, Project, Issue
│   │   ├── hooks/              # React Query hooks
│   │   ├── services/           # API client
│   │   ├── stores/             # Zustand stores
│   │   ├── pages/              # Route pages
│   │   ├── types/              # TypeScript types
│   │   └── utils/              # Helper functions
│   ├── package.json
│   └── vite.config.ts
│
├── docker-compose.yml
├── .gitignore
└── README.md
```

## 🔧 Development Commands

### Docker

```bash
# Start all services
docker-compose up -d

# Stop all services
docker-compose down

# View logs
docker-compose logs -f [service-name]

# Rebuild containers
docker-compose up -d --build

# Access PostgreSQL CLI
docker-compose exec postgres psql -U minipgmt_user -d minipgmt

# Access Redis CLI
docker-compose exec redis redis-cli
```

### Backend

```bash
# Run tests
./mvnw test

# Build JAR
./mvnw clean package

# Run specific test
./mvnw test -Dtest=UserServiceTest

# Generate coverage report
./mvnw jacoco:report
```

### Frontend

```bash
# Run tests
npm test

# Build for production
npm run build

# Preview production build
npm run preview

# Lint
npm run lint

# Type check
npm run type-check
```

## 🔐 Environment Variables

### Backend (.env or application.yml)

```yaml
SPRING_DATASOURCE_URL=jdbc:postgresql://localhost:5432/minipgmt
SPRING_DATASOURCE_USERNAME=minipgmt_user
SPRING_DATASOURCE_PASSWORD=minipgmt_pass
JWT_SECRET=your-256-bit-secret-key-change-in-production
JWT_EXPIRATION=900000
JWT_REFRESH_EXPIRATION=604800000
```

### Frontend (.env)

```
VITE_API_URL=http://localhost:8080
VITE_WS_URL=ws://localhost:8080/ws
```

## 📊 API Documentation

Once the backend is running, API documentation is available at:
- **Swagger UI**: http://localhost:8080/swagger-ui.html
- **OpenAPI JSON**: http://localhost:8080/v3/api-docs

## 🎨 Design System

The project follows a design-system-first approach with centralized design tokens:

- **Colors**: Semantic colors for priority, status, health indicators
- **Typography**: Inter font with consistent scales
- **Spacing**: 8px grid system
- **Shadows**: Professional elevation system
- **Components**: Atomic design pattern (tokens → primitives → patterns → features)

Any changes to design tokens automatically cascade throughout the application.

## 🧪 Testing

### Backend Testing
- Unit tests with JUnit 5 + Mockito
- Integration tests with TestContainers
- Security tests for authentication
- Target: 80% code coverage

### Frontend Testing
- Component tests with React Testing Library
- Integration tests with Cypress
- Visual regression tests
- Accessibility tests (WCAG 2.1 AA)

## 📈 Performance Targets

- Initial load: < 3s on 3G
- Time to interactive: < 5s
- API response: < 200ms (reads), < 500ms (writes)
- Bundle size: < 500KB initial JS
- Lighthouse score: > 90

## 🔒 Security Features

- JWT authentication with refresh tokens
- HTTP-only cookies
- CSRF protection
- Rate limiting on auth endpoints
- Input validation
- SQL injection prevention
- XSS protection with CSP
- Password hashing with BCrypt

## 📝 License

This project is for demonstration purposes.

## 🙏 Acknowledgments

Built with professional standards and modern best practices for enterprise project management solutions.
