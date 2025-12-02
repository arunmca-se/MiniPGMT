# Migration Guide: From Traditional React to Modern Architecture

This guide shows how to migrate from traditional React patterns (prop drilling, manual state management) to modern patterns (React Query, React Router, async/await backend).

## Overview

**Before:**
- Manual state management with `useState`
- Prop drilling (8+ props passed down)
- Callback functions everywhere
- Manual cache invalidation
- Manual loading states
- Callback-based backend

**After:**
- React Query for server state
- React Router for navigation state
- Zero prop drilling
- Automatic cache management
- Automatic loading states
- Async/await backend

---

## Step 1: Install Dependencies

```bash
npm install react-router-dom @tanstack/react-query
```

**Time:** 2 minutes

---

## Step 2: Set Up React Router & React Query

### Before (main.tsx):
```typescript
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
)
```

### After (main.tsx):
```typescript
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </BrowserRouter>
  </StrictMode>
)
```

**Time:** 5 minutes

---

## Step 3: Convert App Component to Routes

### Before (App.tsx - 180+ lines):
```typescript
export default function App() {
  const [data, setData] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [viewMode, setViewMode] = useState('list');
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    const result = await api.getAll();
    setData(result);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleItemClick = (item) => {
    setSelectedItem(item);
    setViewMode('detail');
  };

  const handleBack = () => {
    setViewMode('list');
    setSelectedItem(null);
  };

  // ... many more handlers ...

  if (viewMode === 'detail') {
    return <DetailView item={selectedItem} onBack={handleBack} />;
  }

  return <ListView items={data} onItemClick={handleItemClick} />;
}
```

### After (App.tsx - 12 lines):
```typescript
import { Routes, Route } from 'react-router-dom';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<ListView />} />
      <Route path="/items/:id" element={<DetailView />} />
    </Routes>
  );
}
```

**Time:** 10 minutes

**Key Changes:**
- Removed all state management
- Removed all handler functions
- Removed conditional rendering
- Added Routes configuration

---

## Step 4: Create React Query Hooks

Create a new file for your data hooks:

### hooks/useItems.ts:
```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/services/api';

// Query keys
export const itemKeys = {
  all: ['items'] as const,
  detail: (id: string) => ['items', id] as const,
};

// Get all items
export function useItems() {
  return useQuery({
    queryKey: itemKeys.all,
    queryFn: () => api.getAll(),
  });
}

// Get single item
export function useItem(id: string | undefined) {
  return useQuery({
    queryKey: itemKeys.detail(id!),
    queryFn: () => api.getById(id!),
    enabled: !!id,
  });
}

// Create item
export function useCreateItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => api.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: itemKeys.all });
    },
  });
}

// Update item
export function useUpdateItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => api.update(id, data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: itemKeys.all });
      queryClient.invalidateQueries({ queryKey: itemKeys.detail(variables.id) });
    },
  });
}

// Delete item
export function useDeleteItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => api.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: itemKeys.all });
    },
  });
}
```

**Time:** 20 minutes

---

## Step 5: Refactor List Component

### Before (ListView.tsx):
```typescript
interface ListViewProps {
  items: Item[];
  onItemClick: (item: Item) => void;
  onRefresh: () => void;
  loading: boolean;
  error: string | null;
}

export function ListView({ items, onItemClick, onRefresh, loading, error }: ListViewProps) {
  if (loading) return <Loader />;
  if (error) return <Error message={error} />;

  return (
    <div>
      {items.map(item => (
        <ItemCard key={item.id} item={item} onClick={() => onItemClick(item)} />
      ))}
    </div>
  );
}
```

### After (ListView.tsx):
```typescript
import { useNavigate } from 'react-router-dom';
import { useItems } from '@/hooks/useItems';

export function ListView() {
  const navigate = useNavigate();
  const { data: items = [], isLoading, error, refetch } = useItems();

  if (isLoading) return <Loader />;
  if (error) return <Error message={error.message} />;

  return (
    <div>
      <button onClick={() => refetch()}>Refresh</button>
      {items.map(item => (
        <ItemCard
          key={item.id}
          item={item}
          onClick={() => navigate(`/items/${item.id}`)}
        />
      ))}
    </div>
  );
}
```

**Time:** 15 minutes per component

**Key Changes:**
- Removed all props
- Added `useNavigate()` hook
- Added `useItems()` hook
- Component is now self-contained

---

## Step 6: Refactor Detail Component

### Before (DetailView.tsx):
```typescript
interface DetailViewProps {
  item: Item;
  onBack: () => void;
  onUpdate: (id: string, data: Partial<Item>) => void;
  onDelete: (id: string) => void;
}

export function DetailView({ item, onBack, onUpdate, onDelete }: DetailViewProps) {
  return (
    <div>
      <button onClick={onBack}>Back</button>
      <h1>{item.name}</h1>
      {/* ... */}
    </div>
  );
}
```

### After (DetailView.tsx):
```typescript
import { useParams, useNavigate } from 'react-router-dom';
import { useItem, useUpdateItem, useDeleteItem } from '@/hooks/useItems';

export function DetailView() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: item, isLoading, error } = useItem(id);
  const updateMutation = useUpdateItem();
  const deleteMutation = useDeleteItem();

  if (isLoading) return <Loader />;
  if (error || !item) return <Error message="Item not found" />;

  const handleUpdate = async (data: Partial<Item>) => {
    await updateMutation.mutateAsync({ id: item.id, data });
  };

  const handleDelete = async () => {
    await deleteMutation.mutateAsync(item.id);
    navigate('/');
  };

  return (
    <div>
      <button onClick={() => navigate('/')}>Back</button>
      <h1>{item.name}</h1>
      {/* ... */}
    </div>
  );
}
```

**Time:** 20 minutes per component

**Key Changes:**
- Removed all props
- Added `useParams()` to get ID from URL
- Added `useNavigate()` for navigation
- Added mutation hooks for updates/deletes
- Component fetches its own data

---

## Step 7: Refactor Modal Components

### Before (CreateItemModal.tsx):
```typescript
interface CreateItemModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: CreateItemDTO) => Promise<void>;
}

export function CreateItemModal({ open, onClose, onSubmit }: CreateItemModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (data: CreateItemDTO) => {
    setIsSubmitting(true);
    try {
      await onSubmit(data);
      onClose();
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      {/* form */}
    </Dialog>
  );
}
```

### After (CreateItemModal.tsx):
```typescript
import { useCreateItem } from '@/hooks/useItems';

interface CreateItemModalProps {
  open: boolean;
  onClose: () => void;
}

export function CreateItemModal({ open, onClose }: CreateItemModalProps) {
  const createMutation = useCreateItem();

  const handleSubmit = async (data: CreateItemDTO) => {
    try {
      await createMutation.mutateAsync(data);
      onClose();
      // React Query automatically refetches!
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      {/* form */}
      <button disabled={createMutation.isPending}>
        {createMutation.isPending ? 'Creating...' : 'Create'}
      </button>
    </Dialog>
  );
}
```

**Time:** 10 minutes per modal

**Key Changes:**
- Removed `onSubmit` prop
- Added mutation hook
- Removed manual loading state
- No need to manually trigger refresh

---

## Step 8: Refactor Backend to Async/Await

### Create Database Promisifiers (database.js):

Add these helpers to your database file:

```javascript
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

module.exports = { db, dbRun, dbGet, dbAll };
```

**Time:** 10 minutes

---

## Step 9: Refactor Route Handlers

### Before (routes/items.js):
```javascript
const { db } = require('../database');

router.get('/', (req, res) => {
  db.all('SELECT * FROM items', [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

router.post('/', (req, res) => {
  const { name, description } = req.body;
  db.run(
    'INSERT INTO items (name, description) VALUES (?, ?)',
    [name, description],
    function(err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.status(201).json({ id: this.lastID });
    }
  );
});
```

### After (routes/items.js):
```javascript
const { dbRun, dbGet, dbAll } = require('../database');

router.get('/', async (req, res) => {
  try {
    const rows = await dbAll('SELECT * FROM items', []);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const { name, description } = req.body;
    const result = await dbRun(
      'INSERT INTO items (name, description) VALUES (?, ?)',
      [name, description]
    );
    res.status(201).json({ id: result.lastID });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

**Time:** 5 minutes per route

**Pattern to Apply:**
1. Change `(req, res)` to `async (req, res)`
2. Replace `db.all/get/run` with `await dbAll/dbGet/dbRun`
3. Wrap in try-catch
4. Remove callback parameters

---

## Checklist: Is Your Migration Complete?

### Frontend
- [ ] React Router installed and configured
- [ ] React Query installed and configured
- [ ] App.tsx simplified to just Routes
- [ ] Created custom React Query hooks
- [ ] All list components use hooks (no props for data)
- [ ] All detail components use `useParams()` and hooks
- [ ] All modal components use mutation hooks
- [ ] Navigation uses `useNavigate()` hook
- [ ] Removed all prop drilling
- [ ] Removed all manual state management for server data

### Backend
- [ ] Created `dbRun`, `dbGet`, `dbAll` promisifiers
- [ ] All route handlers are `async` functions
- [ ] All database calls use `await`
- [ ] All routes have try-catch error handling
- [ ] Consistent error response format

---

## Expected Results

### Code Reduction
- **App component:** 70-95% smaller
- **List components:** 40-60% smaller (removed prop types and handlers)
- **Detail components:** 30-50% smaller (removed prop types and handlers)
- **Overall:** 30-50% less code

### Improvements
✅ No prop drilling
✅ Automatic caching
✅ Optimistic updates
✅ Better error handling
✅ Cleaner code
✅ Better UX (browser navigation)
✅ Bookmarkable URLs

---

## Common Pitfalls

### 1. Forgetting to Invalidate Queries
```typescript
// ❌ Bad - no cache invalidation
export function useCreateItem() {
  return useMutation({
    mutationFn: (data) => api.create(data),
  });
}

// ✅ Good - invalidates cache
export function useCreateItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => api.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: itemKeys.all });
    },
  });
}
```

### 2. Not Using URL Params
```typescript
// ❌ Bad - passing data as props
<Route path="/items/:id" element={<DetailView item={item} />} />

// ✅ Good - fetch data using URL param
<Route path="/items/:id" element={<DetailView />} />

// In DetailView:
const { id } = useParams();
const { data: item } = useItem(id);
```

### 3. Manual Loading States
```typescript
// ❌ Bad - manual loading state
const [loading, setLoading] = useState(false);
const handleCreate = async () => {
  setLoading(true);
  await createItem();
  setLoading(false);
};

// ✅ Good - React Query handles it
const createMutation = useCreateItem();
const handleCreate = () => createMutation.mutate(data);
// Use createMutation.isPending for loading state
```

---

## Testing After Migration

Test these scenarios:

- [ ] Navigate to list view - data loads
- [ ] Click item - URL changes, detail view loads
- [ ] Browser back button - returns to list
- [ ] Refresh on detail page - data reloads correctly
- [ ] Create new item - appears in list automatically
- [ ] Update item - changes reflect immediately
- [ ] Delete item - removed from list automatically
- [ ] Error handling - errors display correctly
- [ ] Loading states - spinners show during operations

---

## Performance Comparison

### Before
- API called every time component mounts
- Manual cache invalidation often missed
- Stale data common
- Props passed through 3-4 levels
- Re-renders cascade through component tree

### After
- API called once, cached for 5 minutes
- Automatic cache invalidation
- Always fresh data
- No props to pass
- Only relevant components re-render

---

## Rollback Plan

If migration causes issues:

1. Keep old code in `git` branch
2. Migrate one component at a time
3. Test thoroughly after each component
4. Can run both patterns side-by-side during transition

---

## Additional Resources

- [React Query Documentation](https://tanstack.com/query/latest)
- [React Router Documentation](https://reactrouter.com/)
- [Migration Examples](./ARCHITECTURE.md)

---

**Estimated Total Migration Time:** 4-8 hours (depending on app size)

**Difficulty:** Moderate (but worth it!)

**ROI:** Significant improvement in code quality, maintainability, and UX
