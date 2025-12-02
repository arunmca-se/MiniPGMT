# MiniPGMT Quick Reference Guide

## Common Tasks

### Adding a New Feature

#### 1. Adding a New API Endpoint

**Backend (backend/routes/YOUR_ROUTE.js):**
```javascript
const { dbRun, dbGet, dbAll } = require('../database');

// GET endpoint
router.get('/your-endpoint', async (req, res) => {
  try {
    const data = await dbAll('SELECT * FROM your_table', []);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST endpoint
router.post('/your-endpoint', async (req, res) => {
  try {
    const { field1, field2 } = req.body;
    const result = await dbRun(
      'INSERT INTO your_table (field1, field2) VALUES (?, ?)',
      [field1, field2]
    );
    res.status(201).json({ id: result.lastID });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

#### 2. Adding a React Query Hook

**Frontend (src/hooks/useYourFeature.ts):**
```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { yourApi } from '@/services/api';

// Query hook
export function useYourData() {
  return useQuery({
    queryKey: ['your-data'],
    queryFn: () => yourApi.getAll(),
  });
}

// Mutation hook
export function useCreateYourData() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => yourApi.create(data),
    onSuccess: () => {
      // Invalidate to refetch
      queryClient.invalidateQueries({ queryKey: ['your-data'] });
    },
  });
}
```

#### 3. Using the Hook in a Component

**Frontend (src/components/YourComponent.tsx):**
```typescript
import { useYourData, useCreateYourData } from '@/hooks/useYourFeature';

export function YourComponent() {
  const { data, isLoading, error } = useYourData();
  const createMutation = useCreateYourData();

  const handleCreate = async (formData) => {
    try {
      await createMutation.mutateAsync(formData);
      // React Query auto-refetches, no manual state updates needed!
    } catch (error) {
      console.error('Error:', error);
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      {data.map(item => (
        <div key={item.id}>{item.name}</div>
      ))}
      <button onClick={() => handleCreate(...)}>Create</button>
    </div>
  );
}
```

---

## Common Patterns

### Navigation Between Pages

```typescript
import { useNavigate } from 'react-router-dom';

function MyComponent() {
  const navigate = useNavigate();

  // Navigate to another page
  navigate('/projects/123');

  // Navigate back
  navigate(-1);

  // Navigate to root
  navigate('/');
}
```

### Getting URL Parameters

```typescript
import { useParams } from 'react-router-dom';

function ProjectDetail() {
  const { id } = useParams<{ id: string }>();
  const { data: project } = useProject(id);
  // ...
}
```

### Loading States

```typescript
// Automatic from React Query
const { data, isLoading, error } = useProjects();

if (isLoading) return <Loader />;
if (error) return <ErrorDisplay error={error} />;
return <DataDisplay data={data} />;
```

### Optimistic Updates

```typescript
export function useUpdateProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => projectsApi.update(id, data),

    // Optimistic update
    onMutate: async ({ id, data }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['projects', id] });

      // Snapshot previous value
      const previous = queryClient.getQueryData(['projects', id]);

      // Optimistically update
      queryClient.setQueryData(['projects', id], (old) => ({
        ...old,
        ...data,
      }));

      return { previous };
    },

    // Rollback on error
    onError: (err, variables, context) => {
      queryClient.setQueryData(
        ['projects', variables.id],
        context.previous
      );
    },

    // Always refetch after
    onSettled: (data, error, variables) => {
      queryClient.invalidateQueries({ queryKey: ['projects', variables.id] });
    },
  });
}
```

---

## Database Queries

### Simple Query
```javascript
const rows = await dbAll('SELECT * FROM projects WHERE status = ?', ['active']);
```

### Single Row
```javascript
const row = await dbGet('SELECT * FROM projects WHERE id = ?', [projectId]);
```

### Insert with Return ID
```javascript
const result = await dbRun(
  'INSERT INTO projects (id, name) VALUES (?, ?)',
  [id, name]
);
console.log('New ID:', result.lastID);
```

### Update
```javascript
const result = await dbRun(
  'UPDATE projects SET name = ? WHERE id = ?',
  [newName, projectId]
);
console.log('Rows changed:', result.changes);
```

### Delete
```javascript
await dbRun('DELETE FROM projects WHERE id = ?', [projectId]);
```

### Complex Join
```javascript
const query = `
  SELECT
    p.*,
    t.id as task_id,
    t.name as task_name
  FROM projects p
  LEFT JOIN tasks t ON p.id = t.project_id
  WHERE p.status = ?
`;
const rows = await dbAll(query, ['active']);
```

---

## Styling Patterns

### Using Tailwind Classes
```tsx
<div className="flex items-center space-x-4 p-4 bg-white rounded-lg shadow">
  <h1 className="text-2xl font-bold text-gray-900">Title</h1>
  <Button variant="primary" size="lg">Click Me</Button>
</div>
```

### Conditional Classes
```tsx
import { cn } from '@/lib/utils';

<div className={cn(
  "base-classes",
  isActive && "active-classes",
  isDisabled && "disabled-classes"
)}>
  Content
</div>
```

### Component Variants (using CVA)
```tsx
import { cva } from 'class-variance-authority';

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium",
  {
    variants: {
      variant: {
        default: "bg-primary text-white hover:bg-primary/90",
        destructive: "bg-red-500 text-white hover:bg-red-600",
        outline: "border border-input hover:bg-accent",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 px-3",
        lg: "h-11 px-8",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

<button className={buttonVariants({ variant: "outline", size: "lg" })}>
  Button
</button>
```

---

## TypeScript Patterns

### Defining Types
```typescript
// src/types/index.ts
export type Status = 'active' | 'inactive' | 'pending';

export interface Project {
  id: string;
  name: string;
  status: Status;
  createdAt: string;
}

export interface CreateProjectDTO {
  name: string;
  status?: Status;
}
```

### Using Types
```typescript
import type { Project, CreateProjectDTO } from '@/types';

function createProject(data: CreateProjectDTO): Promise<Project> {
  return api.post('/projects', data);
}
```

### Generic Hooks
```typescript
function useResource<T>(key: string, fetcher: () => Promise<T>) {
  return useQuery<T>({
    queryKey: [key],
    queryFn: fetcher,
  });
}
```

---

## Testing Checklist

### Before Committing
- [ ] Run `npm run lint` - No linting errors
- [ ] Check TypeScript - No type errors
- [ ] Test in browser - Feature works
- [ ] Check console - No errors
- [ ] Test error states - Errors handled gracefully
- [ ] Test loading states - Loading indicators show

### Feature Testing
- [ ] Create operation works
- [ ] Read/list operation works
- [ ] Update operation works
- [ ] Delete operation works
- [ ] Cache invalidates correctly
- [ ] Error handling works
- [ ] Loading states display
- [ ] Navigation works
- [ ] URL updates correctly (if applicable)
- [ ] Browser back/forward works

---

## Debugging Tips

### React Query DevTools
```typescript
// Add to main.tsx in development
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

<QueryClientProvider client={queryClient}>
  <App />
  <ReactQueryDevtools initialIsOpen={false} />
</QueryClientProvider>
```

### Logging Queries
```typescript
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      onError: (error) => console.error('Query error:', error),
      onSuccess: (data) => console.log('Query success:', data),
    },
  },
});
```

### Backend Debugging
```javascript
// Add request logging
router.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`, req.body);
  next();
});
```

---

## Performance Tips

### 1. Avoid Over-Fetching
```typescript
// Bad: Fetching all data when you need one
const { data: projects } = useProjects();
const project = projects.find(p => p.id === id);

// Good: Fetch only what you need
const { data: project } = useProject(id);
```

### 2. Use Proper Cache Keys
```typescript
// Hierarchical cache keys
export const projectKeys = {
  all: ['projects'] as const,
  lists: () => [...projectKeys.all, 'list'] as const,
  list: (filters) => [...projectKeys.lists(), { filters }] as const,
  details: () => [...projectKeys.all, 'detail'] as const,
  detail: (id) => [...projectKeys.details(), id] as const,
};
```

### 3. Memoize Expensive Calculations
```typescript
import { useMemo } from 'react';

const filteredData = useMemo(() => {
  return data.filter(item => item.status === filter);
}, [data, filter]);
```

### 4. Use Database Indexes
```sql
CREATE INDEX idx_project_status ON projects(status);
CREATE INDEX idx_task_project_id ON tasks(project_id);
```

---

## Environment Variables

### Frontend (.env)
```env
VITE_API_URL=http://localhost:3001/api
```

### Backend (backend/.env)
```env
NODE_ENV=development
PORT=3001
DB_PATH=./projects.db
```

### Usage
```typescript
// Frontend
const apiUrl = import.meta.env.VITE_API_URL;

// Backend
const port = process.env.PORT || 3001;
```

---

## Git Workflow

```bash
# Create feature branch
git checkout -b feature/your-feature-name

# Make changes and commit
git add .
git commit -m "feat: add new feature"

# Push to remote
git push origin feature/your-feature-name

# Create pull request
# After review and approval, merge to main
```

### Commit Message Conventions
- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting)
- `refactor:` - Code refactoring
- `test:` - Adding tests
- `chore:` - Maintenance tasks

---

## Common Errors & Solutions

### Error: "Cannot read property 'id' of undefined"
**Solution:** Add optional chaining
```typescript
const project = data?.find(p => p.id === id);
```

### Error: "Query was cancelled"
**Solution:** This is normal when navigating away quickly. React Query cleans up.

### Error: "ERR_CONNECTION_REFUSED"
**Solution:** Ensure backend is running on correct port

### Error: "CORS policy blocking request"
**Solution:** Check backend CORS configuration includes frontend origin

### Error: "Database is locked"
**Solution:** Close all connections and restart backend

---

## Useful Commands

```bash
# Install dependencies
npm run install:all

# Start development servers
npm run dev

# Start only frontend
npm run dev:frontend

# Start only backend
npm run dev:backend

# Build for production
npm run build

# Run linter
npm run lint

# Type check
npx tsc --noEmit

# Check for updates
npm outdated
```

---

## Resources

- **React Query:** https://tanstack.com/query/latest
- **React Router:** https://reactrouter.com/
- **Tailwind CSS:** https://tailwindcss.com/
- **Radix UI:** https://www.radix-ui.com/
- **TypeScript:** https://www.typescriptlang.org/

---

## Quick Wins

### Add New Status to Project
1. Update type in `src/types/index.ts`
2. Update database enum validation (if any)
3. Add UI option in status select component

### Add New Field to Project
1. Add column to database: `ALTER TABLE projects ADD COLUMN new_field TEXT;`
2. Update TypeScript interface in `src/types/index.ts`
3. Update API response mapping in `backend/routes/projects.js`
4. Add field to forms in `src/components/AddProjectModal.tsx`
5. Display field in `src/components/ProjectDetail.tsx`

### Change Cache Duration
```typescript
// In src/main.tsx
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 10, // Change to 10 minutes
    },
  },
});
```

---

**Last Updated:** December 3, 2025
**Version:** 2.0.0
