import {
  type User,
  type Project,
  type Issue,
  type Activity,
  type DashboardStats,
} from '../types';

/**
 * Mock data for development
 */

export const mockUsers: User[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john.doe@example.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John',
    role: 'admin',
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jane',
    role: 'member',
  },
  {
    id: '3',
    name: 'Mike Johnson',
    email: 'mike.johnson@example.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mike',
    role: 'member',
  },
  {
    id: '4',
    name: 'Sarah Williams',
    email: 'sarah.williams@example.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
    role: 'member',
  },
  {
    id: '5',
    name: 'Tom Brown',
    email: 'tom.brown@example.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Tom',
    role: 'viewer',
  },
];

export const mockProjects: Project[] = [
  {
    id: '1',
    key: 'ECOM',
    name: 'E-Commerce Platform',
    description: 'Building a modern e-commerce platform with microservices architecture',
    health: 'onTrack',
    progress: 75,
    dueDate: 'Dec 15, 2025',
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-11-28T00:00:00Z',
    teamMembers: [mockUsers[0], mockUsers[1], mockUsers[2]],
    issueCount: {
      total: 45,
      completed: 34,
    },
  },
  {
    id: '2',
    key: 'MOBILE',
    name: 'Mobile App Redesign',
    description: 'Complete redesign of mobile application with new UI/UX',
    health: 'atRisk',
    progress: 45,
    dueDate: 'Jan 30, 2026',
    createdAt: '2025-02-15T00:00:00Z',
    updatedAt: '2025-11-29T00:00:00Z',
    teamMembers: [mockUsers[1], mockUsers[3], mockUsers[4]],
    issueCount: {
      total: 32,
      completed: 14,
    },
  },
  {
    id: '3',
    key: 'API',
    name: 'API Gateway Service',
    description: 'Implementing centralized API gateway with authentication and rate limiting',
    health: 'behind',
    progress: 30,
    dueDate: 'Dec 31, 2025',
    createdAt: '2025-03-01T00:00:00Z',
    updatedAt: '2025-11-30T00:00:00Z',
    teamMembers: [mockUsers[0], mockUsers[2]],
    issueCount: {
      total: 28,
      completed: 8,
    },
  },
  {
    id: '4',
    key: 'DATA',
    name: 'Data Analytics Dashboard',
    description: 'Real-time analytics dashboard with interactive visualizations',
    health: 'onTrack',
    progress: 85,
    dueDate: 'Dec 10, 2025',
    createdAt: '2025-04-01T00:00:00Z',
    updatedAt: '2025-12-01T00:00:00Z',
    teamMembers: [mockUsers[2], mockUsers[3]],
    issueCount: {
      total: 22,
      completed: 19,
    },
  },
];

export const mockIssues: Issue[] = [
  {
    id: '1',
    key: 'ECOM-101',
    title: 'Implement shopping cart functionality',
    description: '<p>Add shopping cart with quantity management and price calculation.</p><h2>Requirements</h2><ul><li>Add/remove items from cart</li><li>Update quantities</li><li>Calculate total price with taxes</li><li>Persist cart across sessions</li></ul>',
    type: 'story',
    priority: 'high',
    status: 'inProgress',
    projectKey: 'ECOM',
    assignee: mockUsers[1],
    reporter: mockUsers[0],
    storyPoints: 5,
    dueDate: '2025-12-08',
    createdAt: '2025-11-25T00:00:00Z',
    updatedAt: '2025-12-01T00:00:00Z',
    commentCount: 3,
    attachmentCount: 2,
  },
  {
    id: '2',
    key: 'ECOM-102',
    title: 'Payment gateway integration',
    description: '<p>Integrate <strong>Stripe</strong> payment gateway for checkout process.</p><h2>Tasks</h2><ol><li>Set up Stripe account and API keys</li><li>Implement payment form with card validation</li><li>Handle payment processing and webhooks</li><li>Add error handling for failed transactions</li></ol><p>Documentation: <a href="https://stripe.com/docs">https://stripe.com/docs</a></p>',
    type: 'task',
    priority: 'highest',
    status: 'todo',
    projectKey: 'ECOM',
    assignee: mockUsers[0],
    reporter: mockUsers[0],
    storyPoints: 8,
    dueDate: '2025-12-05',
    createdAt: '2025-11-26T00:00:00Z',
    updatedAt: '2025-11-30T00:00:00Z',
    commentCount: 1,
    attachmentCount: 0,
  },
  {
    id: '3',
    key: 'MOBILE-45',
    title: 'Fix crash on login screen',
    description: '<p>App crashes when user enters invalid credentials.</p><h2>Steps to Reproduce</h2><ol><li>Open the app</li><li>Navigate to login screen</li><li>Enter invalid email/password</li><li>Click "Login" button</li><li>App crashes</li></ol><h2>Expected Behavior</h2><p>Show error message: <em>"Invalid credentials. Please try again."</em></p><blockquote><p>Priority: HIGH - Affects user authentication flow</p></blockquote>',
    type: 'bug',
    priority: 'highest',
    status: 'inProgress',
    projectKey: 'MOBILE',
    assignee: mockUsers[3],
    reporter: mockUsers[4],
    storyPoints: 3,
    dueDate: '2025-12-04',
    createdAt: '2025-12-01T00:00:00Z',
    updatedAt: '2025-12-02T00:00:00Z',
    commentCount: 5,
    attachmentCount: 1,
  },
  {
    id: '4',
    key: 'API-23',
    title: 'Implement rate limiting',
    description: '<p>Add rate limiting to prevent API abuse and ensure fair usage.</p><h2>Implementation</h2><ul><li>Use Redis for distributed rate limiting</li><li>Configure limits: 100 req/min per user, 1000 req/min per IP</li><li>Return <code>429 Too Many Requests</code> with retry-after header</li></ul><p>Reference library: <code>express-rate-limit</code></p>',
    type: 'task',
    priority: 'high',
    status: 'inReview',
    projectKey: 'API',
    assignee: mockUsers[2],
    reporter: mockUsers[0],
    storyPoints: 5,
    dueDate: '2025-12-10',
    createdAt: '2025-11-28T00:00:00Z',
    updatedAt: '2025-12-03T00:00:00Z',
    commentCount: 2,
    attachmentCount: 0,
  },
  {
    id: '5',
    key: 'DATA-15',
    title: 'Create revenue charts',
    description: '<p>Design and implement interactive revenue visualization charts.</p><h2>Chart Types</h2><ul><li>Line chart for monthly revenue trends</li><li>Bar chart for revenue by product category</li><li>Pie chart for revenue distribution</li></ul><p>Use <strong>Recharts</strong> library for implementation.</p>',
    type: 'story',
    priority: 'medium',
    status: 'done',
    projectKey: 'DATA',
    assignee: mockUsers[3],
    reporter: mockUsers[2],
    storyPoints: 5,
    createdAt: '2025-11-20T00:00:00Z',
    updatedAt: '2025-11-30T00:00:00Z',
    commentCount: 4,
    attachmentCount: 3,
  },
  {
    id: '6',
    key: 'ECOM-103',
    title: 'Add product search with filters',
    description: 'Implement full-text search with category and price filters',
    type: 'story',
    priority: 'medium',
    status: 'todo',
    projectKey: 'ECOM',
    assignee: mockUsers[1],
    reporter: mockUsers[0],
    storyPoints: 8,
    dueDate: '2025-12-12',
    createdAt: '2025-11-27T00:00:00Z',
    updatedAt: '2025-11-29T00:00:00Z',
    commentCount: 0,
    attachmentCount: 1,
  },
];

export const mockActivities: Activity[] = [
  {
    id: '1',
    type: 'status_changed',
    user: mockUsers[1],
    issue: mockIssues[0],
    description: 'moved ECOM-101 from To Do to In Progress',
    timestamp: '2025-12-03T10:30:00Z',
  },
  {
    id: '2',
    type: 'comment_added',
    user: mockUsers[3],
    issue: mockIssues[2],
    description: 'commented on MOBILE-45: "Found the root cause, fixing now"',
    timestamp: '2025-12-03T10:15:00Z',
  },
  {
    id: '3',
    type: 'issue_created',
    user: mockUsers[0],
    issue: mockIssues[1],
    description: 'created ECOM-102: Payment gateway integration',
    timestamp: '2025-12-03T09:45:00Z',
  },
  {
    id: '4',
    type: 'assigned',
    user: mockUsers[0],
    issue: mockIssues[1],
    description: 'assigned ECOM-102 to themselves',
    timestamp: '2025-12-03T09:46:00Z',
  },
  {
    id: '5',
    type: 'status_changed',
    user: mockUsers[2],
    issue: mockIssues[3],
    description: 'moved API-23 from In Progress to In Review',
    timestamp: '2025-12-03T09:00:00Z',
  },
  {
    id: '6',
    type: 'issue_updated',
    user: mockUsers[3],
    issue: mockIssues[4],
    description: 'updated DATA-15 description',
    timestamp: '2025-12-03T08:30:00Z',
  },
];

export const mockDashboardStats: DashboardStats = {
  totalProjects: 4,
  activeProjects: 3,
  totalIssues: 105,
  myAssignedIssues: 8,
  completedThisWeek: 12,
  overdueIssues: 3,
};

// Helper function to get current user (mock)
export const getCurrentUser = (): User => mockUsers[0];

// Helper function to get user's assigned issues
export const getMyAssignedIssues = (): Issue[] => {
  const currentUser = getCurrentUser();
  return mockIssues.filter(issue => issue.assignee?.id === currentUser.id);
};

// Helper function to get attention required issues (high priority bugs, overdue)
export const getAttentionRequiredIssues = (): Issue[] => {
  return mockIssues.filter(
    issue =>
      (issue.priority === 'highest' && issue.type === 'bug') ||
      (issue.dueDate && new Date(issue.dueDate) < new Date() && issue.status !== 'done')
  );
};

// Helper function to get upcoming deadlines
export const getUpcomingDeadlines = (): Issue[] => {
  const today = new Date();
  const nextWeek = new Date();
  nextWeek.setDate(today.getDate() + 7);

  return mockIssues
    .filter(issue => {
      if (!issue.dueDate || issue.status === 'done') return false;
      const dueDate = new Date(issue.dueDate);
      return dueDate >= today && dueDate <= nextWeek;
    })
    .sort((a, b) => {
      return new Date(a.dueDate!).getTime() - new Date(b.dueDate!).getTime();
    });
};
