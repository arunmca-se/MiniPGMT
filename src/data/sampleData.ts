import type { Project } from '@/types';

export const sampleProjects: Project[] = [
  {
    id: "proj-1",
    name: "Healthplus Mobile App",
    description: "Main health management application for tracking medical records and appointments",
    status: "in-progress",
    priority: "high",
    startDate: "2025-01-15",
    dueDate: "2025-06-30",
    progress: 45,
    teamMembers: ["John Doe", "Sarah Wilson", "Mike Chen"],
    tasks: [
      {
        id: "task-1",
        name: "User Authentication Module",
        description: "Implement login, signup, OTP verification and password reset functionality",
        status: "done",
        priority: "high",
        assignee: "John Doe",
        dueDate: "2025-02-15",
        estimatedHours: 40,
        subtasks: [
          { id: "sub-1", name: "Login UI Design", status: "completed" },
          { id: "sub-2", name: "API Integration", status: "completed" },
          { id: "sub-3", name: "OTP Flow Implementation", status: "completed" },
          { id: "sub-4", name: "Password Reset Flow", status: "completed" }
        ]
      },
      {
        id: "task-2",
        name: "Health Document Upload",
        description: "Allow users to upload and organize health documents with categorization",
        status: "in-progress",
        priority: "medium",
        assignee: "Sarah Wilson",
        dueDate: "2025-03-01",
        estimatedHours: 32,
        subtasks: [
          { id: "sub-5", name: "File picker component", status: "completed" },
          { id: "sub-6", name: "Cloud storage integration", status: "pending" },
          { id: "sub-7", name: "Document categorization", status: "pending" },
          { id: "sub-8", name: "Preview functionality", status: "pending" }
        ]
      },
      {
        id: "task-3",
        name: "Appointment Scheduling",
        description: "Calendar integration and appointment management system",
        status: "to-do",
        priority: "medium",
        assignee: "Mike Chen",
        dueDate: "2025-04-15",
        estimatedHours: 48,
        subtasks: [
          { id: "sub-9", name: "Calendar component", status: "pending" },
          { id: "sub-10", name: "Doctor availability API", status: "pending" },
          { id: "sub-11", name: "Booking confirmation", status: "pending" },
          { id: "sub-12", name: "Reminder notifications", status: "pending" }
        ]
      }
    ]
  },
  {
    id: "proj-2",
    name: "E-commerce Dashboard",
    description: "Admin dashboard for managing products, orders, and customer data",
    status: "in-progress",
    priority: "high",
    startDate: "2025-02-01",
    dueDate: "2025-05-15",
    progress: 25,
    teamMembers: ["Alex Thompson", "Lisa Park"],
    tasks: [
      {
        id: "task-4",
        name: "Product Management System",
        description: "CRUD operations for products with inventory tracking",
        status: "in-progress",
        priority: "high",
        assignee: "Alex Thompson",
        dueDate: "2025-03-15",
        estimatedHours: 56,
        subtasks: [
          { id: "sub-13", name: "Product listing page", status: "completed" },
          { id: "sub-14", name: "Add/Edit product forms", status: "pending" },
          { id: "sub-15", name: "Image upload functionality", status: "pending" },
          { id: "sub-16", name: "Inventory management", status: "pending" }
        ]
      },
      {
        id: "task-5",
        name: "Order Management",
        description: "Order tracking and fulfillment workflow",
        status: "to-do",
        priority: "medium",
        assignee: "Lisa Park",
        dueDate: "2025-04-01",
        estimatedHours: 40,
        subtasks: [
          { id: "sub-17", name: "Order listing and filters", status: "pending" },
          { id: "sub-18", name: "Order status updates", status: "pending" },
          { id: "sub-19", name: "Shipping integration", status: "pending" },
          { id: "sub-20", name: "Customer notifications", status: "pending" }
        ]
      }
    ]
  },
  {
    id: "proj-3",
    name: "Company Website Redesign",
    description: "Modern responsive website with updated branding and improved UX",
    status: "completed",
    priority: "medium",
    startDate: "2024-11-01",
    dueDate: "2024-12-31",
    progress: 100,
    teamMembers: ["Emma Rodriguez", "David Kim"],
    tasks: [
      {
        id: "task-6",
        name: "UI/UX Design",
        description: "New design system and user interface mockups",
        status: "done",
        priority: "high",
        assignee: "Emma Rodriguez",
        dueDate: "2024-11-30",
        estimatedHours: 60,
        subtasks: [
          { id: "sub-21", name: "Wireframes and mockups", status: "completed" },
          { id: "sub-22", name: "Design system creation", status: "completed" },
          { id: "sub-23", name: "Responsive layouts", status: "completed" },
          { id: "sub-24", name: "Interactive prototypes", status: "completed" }
        ]
      },
      {
        id: "task-7",
        name: "Frontend Development",
        description: "Implementation of the new design with modern frameworks",
        status: "done",
        priority: "high",
        assignee: "David Kim",
        dueDate: "2024-12-20",
        estimatedHours: 80,
        subtasks: [
          { id: "sub-25", name: "Homepage implementation", status: "completed" },
          { id: "sub-26", name: "About page development", status: "completed" },
          { id: "sub-27", name: "Contact form integration", status: "completed" },
          { id: "sub-28", name: "Performance optimization", status: "completed" }
        ]
      }
    ]
  },
  {
    id: "proj-4",
    name: "Internal CRM System",
    description: "Customer relationship management system for sales team",
    status: "on-hold",
    priority: "low",
    startDate: "2025-03-01",
    dueDate: "2025-08-31",
    progress: 10,
    teamMembers: ["Robert Chang"],
    tasks: [
      {
        id: "task-8",
        name: "Requirements Analysis",
        description: "Gather requirements from stakeholders and create specifications",
        status: "in-review",
        priority: "high",
        assignee: "Robert Chang",
        dueDate: "2025-03-15",
        estimatedHours: 24,
        subtasks: [
          { id: "sub-29", name: "Stakeholder interviews", status: "completed" },
          { id: "sub-30", name: "Feature specification", status: "pending" },
          { id: "sub-31", name: "Technical architecture", status: "pending" },
          { id: "sub-32", name: "Timeline planning", status: "pending" }
        ]
      }
    ]
  }
];

export const calculateProjectProgress = (project: Project): number => {
  if (project.tasks.length === 0) return 0;
  
  const totalSubtasks = project.tasks.reduce((acc, task) => acc + task.subtasks.length, 0);
  if (totalSubtasks === 0) return 0;
  
  const completedSubtasks = project.tasks.reduce(
    (acc, task) => acc + task.subtasks.filter(subtask => subtask.status === 'completed').length,
    0
  );
  
  return Math.round((completedSubtasks / totalSubtasks) * 100);
};

export const isProjectOverdue = (project: Project): boolean => {
  const today = new Date();
  const dueDate = new Date(project.dueDate);
  return today > dueDate && project.status !== 'completed';
};