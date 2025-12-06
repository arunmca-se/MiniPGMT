# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

MiniPGMT is a professional project management tool inspired by Jira, built with React/TypeScript frontend and Java Spring Boot backend (in progress). The project follows a **design-system-first approach** where all UI components consume centralized design tokens.

## Commands

### Frontend Development

```bash
# Start development server
cd frontend && npm run dev
# Access at http://localhost:5173

# Install dependencies
cd frontend && npm install

# Build for production
cd frontend && npm run build

# Type check
cd frontend && npm run type-check

# Lint code
cd frontend && npm run lint
```

### Backend Development (Coming Soon)

```bash
# Start PostgreSQL and Redis
docker-compose up -d postgres redis

# Run Spring Boot application
cd backend && ./mvnw spring-boot:run

# Run tests
cd backend && ./mvnw test

# Build
cd backend && ./mvnw clean package
```

### Docker Commands

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down

# Access PostgreSQL
docker-compose exec postgres psql -U minipgmt_user -d minipgmt
```

## Architecture & Design Principles

### 1. Design System First - CRITICAL

**This is the single most important architectural decision in this project.**

All UI components MUST consume design tokens. NEVER hardcode colors, spacing, shadows, or typography values directly in components.

#### Design Token Location
```
frontend/src/design-system/tokens/
├── colors.ts       - All color definitions (priority, status, neutral, etc.)
├── spacing.ts      - 8px grid system
├── typography.ts   - Font scales, weights, line heights
├── shadows.ts      - Elevation system
└── animations.ts   - Transitions and keyframes
```

#### Component Architecture
```
Design Tokens (Single Source of Truth)
    ↓
Primitive Components (Button, Input, Badge, Avatar, Card)
    ↓
Pattern Components (DataTable, Forms, etc.)
    ↓
Feature Components (Dashboard, KanbanBoard, etc.)
```

**Example - How to use design tokens:**
```typescript
// ✅ CORRECT - Uses design tokens
import { colors } from '../design-system/tokens/colors';

const MyComponent = () => (
  <div style={{ backgroundColor: colors.priority.high.bg, color: colors.priority.high.text }}>
    High Priority
  </div>
);

// ❌ WRONG - Hardcoded colors
const MyComponent = () => (
  <div style={{ backgroundColor: '#FFF3E0', color: '#E65100' }}>
    High Priority
  </div>
);
```

### 2. Component Location & Organization

```
frontend/src/
├── design-system/
│   ├── tokens/              - Design tokens (colors, spacing, etc.)
│   ├── primitives/          - Atomic components (Button, Input, Badge, Avatar, Card)
│   │   ├── Button/
│   │   │   ├── Button.tsx
│   │   │   └── index.ts
│   │   └── ...
│   └── patterns/            - Composite components (DataTable, etc.)
│
├── components/
│   ├── layout/              - Layout components (AppShell, Sidebar, TopNav)
│   └── features/            - Feature-specific components
│       ├── dashboard/       - Dashboard-related components
│       ├── project/         - Project management components
│       ├── issue/           - Issue/task components
│       └── team/            - Team management components
│
├── hooks/                   - Custom React hooks
├── services/api/            - API client and endpoints
├── stores/                  - Zustand stores for global state
├── pages/                   - Route pages
├── types/                   - TypeScript type definitions
└── utils/                   - Utility functions
```

### 3. State Management Strategy

**Server State**: React Query (@tanstack/react-query)
- All API data fetching
- Automatic caching (5-minute stale time)
- Optimistic updates
- Background refetching

**Client State**: Zustand
- Authentication state
- UI state (sidebar collapsed, theme, etc.)
- User preferences

**URL State**: React Router
- Current route
- Query parameters for filters

**Local State**: useState
- Form inputs
- Component-specific UI state

### 4. Component Development Rules

#### When creating new components:

1. **Use TypeScript** - All components must be fully typed
2. **Use forwardRef** - For components that need ref forwarding
3. **Consume Design Tokens** - Never hardcode styling values
4. **Support Variants** - Use `class-variance-authority` for variant management
5. **Include DisplayName** - Set `Component.displayName` for debugging
6. **Export Types** - Export prop types for consumer usage

**Template for new primitive components:**
```typescript
import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../../utils/cn';

const componentVariants = cva(
  'base-classes-here',
  {
    variants: {
      variant: {
        default: 'default-classes',
        // Add more variants
      },
      size: {
        sm: 'small-classes',
        md: 'medium-classes',
        lg: 'large-classes',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
);

export interface ComponentProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof componentVariants> {
  // Add custom props
}

export const Component = React.forwardRef<HTMLDivElement, ComponentProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(componentVariants({ variant, size }), className)}
        {...props}
      />
    );
  }
);

Component.displayName = 'Component';

export default Component;
```

### 5. Styling Guidelines

**Use Tailwind CSS v4** - The project uses the latest Tailwind CSS with `@import "tailwindcss"` syntax.

**Class Ordering Convention:**
1. Layout (display, position, flex, grid)
2. Spacing (margin, padding)
3. Sizing (width, height)
4. Typography (font, text)
5. Visual (background, border, shadow)
6. Interactive (hover, focus, active)
7. Transitions and animations

**Use the `cn()` utility** for conditional classes:
```typescript
import { cn } from '@/utils/cn';

className={cn(
  'base-classes',
  variant === 'primary' && 'variant-classes',
  disabled && 'disabled-classes',
  className // User-provided classes last
)}
```

### 6. Priority and Status Color System

The application uses semantic colors for priorities and statuses. These are defined in design tokens and must be used consistently:

**Priority Levels:**
- `highest` - Red theme (#FFEBEE bg, #C62828 text, #EF5350 border)
- `high` - Orange theme
- `medium` - Yellow theme
- `low` - Green theme
- `lowest` - Blue theme

**Status Types:**
- `todo` - Gray theme
- `inProgress` - Blue theme
- `inReview` - Purple theme
- `blocked` - Red theme
- `done` - Green theme

**Usage:**
```typescript
import { PriorityBadge, StatusBadge } from '@/design-system/primitives/Badge';

<PriorityBadge priority="high" />
<StatusBadge status="inProgress" />
```

### 7. Icon Usage

**Use Lucide React** for all icons. The project has `lucide-react` installed.

```typescript
import { Plus, Edit, Trash2, Check, X } from 'lucide-react';

<Button leftIcon={<Plus className="h-4 w-4" />}>
  Add Project
</Button>
```

**Icon Size Guidelines:**
- 16px (h-4 w-4) - Inline with text, button icons
- 20px (h-5 w-5) - Default for most use cases
- 24px (h-6 w-6) - Section headers, large buttons
- 32px+ - Illustrations, empty states

### 8. Accessibility Requirements (WCAG 2.1 AA)

All components must be accessible:

1. **Keyboard Navigation** - All interactive elements accessible via Tab
2. **Focus Indicators** - Visible focus rings (use `focus-visible:ring-2`)
3. **ARIA Labels** - Use appropriate ARIA attributes
4. **Color Contrast** - Minimum 4.5:1 for normal text
5. **Screen Reader Support** - Use semantic HTML elements
6. **Form Labels** - All inputs must have associated labels

### 9. Performance Considerations

1. **Code Splitting** - Use React.lazy() for route-based splitting
2. **Memoization** - Use React.memo() for expensive components
3. **Virtual Scrolling** - Use for lists with 100+ items
4. **Image Optimization** - Use WebP format, lazy loading
5. **Bundle Size** - Keep initial bundle < 500KB

## Backend Architecture (To Be Implemented)

### Technology Stack
- Java 17+ with Spring Boot 3.x
- Spring Security for JWT authentication
- Spring Data JPA with PostgreSQL
- Spring WebSocket for real-time updates
- Redis for caching
- Flyway for database migrations

### Package Structure
```
com.projectmgmt/
├── config/          - Configuration classes (Security, WebSocket, etc.)
├── domain/          - Entity classes
├── repository/      - JPA repositories
├── service/         - Business logic
├── controller/      - REST controllers
├── dto/             - Data Transfer Objects
├── security/        - JWT and authentication
└── exception/       - Exception handlers
```

### Key Implementation Notes

1. **Use Async/Await Pattern** - All database operations use async patterns
2. **Promisified SQLite** - Clean database queries with try-catch
3. **RESTful API** - Follow REST principles for all endpoints
4. **WebSocket Required** - Real-time updates are mandatory in MVP
5. **JWT Authentication** - 15min access token, 7-day refresh token
6. **Database Indexing** - Index foreign keys and frequently queried columns

## Current Implementation Status

### ✅ Completed

**Frontend Infrastructure:**
- Docker Compose configuration (PostgreSQL, Redis)
- Frontend project initialization (Vite + React + TypeScript)
- Complete design token system (colors, spacing, typography, shadows, animations)
- React Query provider setup (5-minute stale time, optimized caching)
- React Router v7 with AppShell layout wrapper
- Tailwind CSS v4 configuration with CSS custom properties

**Atomic Components (Design System Primitives):**
- Button (6 variants, 4 sizes, loading states, left/right icons)
- Input (validation states, left/right elements, helper text, error states)
- Badge (priority, status, custom variants with icons and dots)
- Avatar (4 sizes, status indicators, avatar groups with overlap)
- Card (4 variants, hoverable, with header/content/footer composition)
- Modal (Radix Dialog with overlay, animations, header/body/footer)
- Select (Radix Select with keyboard navigation)
- Tooltip (Radix Tooltip with positioning)
- Progress (4 variants, 3 sizes, optional labels)
- Toast (Context-based notification system with 4 variants)

**Pattern Components (Composites):**
- StatCard (metrics display with trend indicators)
- ProjectCard (project health, progress bars, team avatars)
- IssueCard (3 layouts: kanban/list/compact, all issue types)

**Layout Components:**
- AppShell (responsive sidebar navigation, top bar, mobile drawer)
  - Collapsible sidebar for desktop
  - Mobile-responsive with hamburger menu
  - Active route highlighting
  - User profile section
  - Notification bell with badge
  - Global search bar

**Pages:**
- Dashboard (Welcome section, Quick stats, Project health cards, My assigned work, Attention required panel, Upcoming deadlines, Activity feed)
- Board/Kanban (Drag-and-drop with @dnd-kit, 4 columns: To Do/In Progress/In Review/Done, Project filter, Real-time status updates)
- Projects List (Grid/list view toggle, Search and filters, Project stats badges, Empty states)
- Component Showcase (Interactive demos of all components)

**Data Layer:**
- TypeScript type definitions for all domain models
- Mock data with realistic content (users, projects, issues, activities)
- Helper functions for data filtering and calculations

### 🚧 In Progress
- Issue detail page
- Additional form components (Checkbox, Radio, Switch, Textarea)
- Team directory page

### ⏳ To Do
- Spring Boot backend initialization
- Database schema and migrations (Flyway)
- JWT authentication (Spring Security)
- REST API implementation
- WebSocket real-time updates (STOMP + SockJS)
- Reports page with charts (Recharts)
- Kanban board with drag-and-drop
- Issue detail page
- Sprint management
- Team management
- Reports and analytics

## Common Tasks

### Adding a New Primitive Component

1. Create component directory: `frontend/src/design-system/primitives/ComponentName/`
2. Create `ComponentName.tsx` using the template above
3. Create `index.ts` for exports
4. Use design tokens for all styling
5. Add to showcase page for testing

### Adding a New Feature Component

1. Create in appropriate feature directory: `frontend/src/components/features/featureName/`
2. Compose using existing primitive components
3. Use React Query hooks for data fetching
4. Follow the same TypeScript and styling patterns

### Updating Design Tokens

1. Edit the appropriate token file in `frontend/src/design-system/tokens/`
2. Changes automatically propagate to all components
3. Test components in showcase page to verify changes

### Adding New API Endpoint (Backend)

1. Define entity in `domain/`
2. Create repository interface in `repository/`
3. Implement business logic in `service/`
4. Create REST controller in `controller/`
5. Add OpenAPI documentation annotations
6. Write unit and integration tests

## Important Reminders

1. **Design Tokens First** - Always use tokens, never hardcode styling values
2. **TypeScript Strict Mode** - All code must pass strict type checking
3. **Professional UI** - All components must look polished (comparable to Linear/Jira)
4. **WebSocket Required** - Real-time updates are mandatory in MVP
5. **Accessibility** - WCAG 2.1 AA compliance is not optional
6. **Performance** - Keep bundle size < 500KB, initial load < 3s
7. **Testing** - Aim for 80% code coverage
8. **No Shortcuts** - Build all features properly, no half-implementations

## Resources

- Design System Showcase: http://localhost:5173 (when dev server running)
- Backend API (when ready): http://localhost:8080
- API Documentation (when ready): http://localhost:8080/swagger-ui.html
- PostgreSQL: localhost:5432 (via Docker)
- Redis: localhost:6379 (via Docker)

## Getting Help

- Check the comprehensive plan at `.claude/plans/precious-kindling-glacier.md`
- Review existing components in `frontend/src/design-system/primitives/`
- Refer to design tokens in `frontend/src/design-system/tokens/`
- Follow the same patterns used in existing code
