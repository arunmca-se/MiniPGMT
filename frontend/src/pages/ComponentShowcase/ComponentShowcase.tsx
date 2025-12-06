import { useState } from 'react';
import { Plus, Trash2, Edit, Save, Search, Mail, User, Check, AlertCircle, HelpCircle } from 'lucide-react';
import { Button } from '../../design-system/primitives/Button';
import { Input } from '../../design-system/primitives/Input';
import { Badge, PriorityBadge, StatusBadge } from '../../design-system/primitives/Badge';
import { Avatar, AvatarGroup } from '../../design-system/primitives/Avatar';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../../design-system/primitives/Card';
import { Modal, ModalContent, ModalHeader, ModalTitle, ModalDescription, ModalBody, ModalFooter, ModalTrigger } from '../../design-system/primitives/Modal';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../design-system/primitives/Select';
import { Tooltip, TooltipContent, TooltipTrigger } from '../../design-system/primitives/Tooltip';
import { Progress } from '../../design-system/primitives/Progress';
import { useToast } from '../../design-system/primitives/Toast';

/**
 * Component Showcase Page
 *
 * This page demonstrates all the UI components in the design system.
 * Use this to verify that all components look professional and work correctly.
 */

export const ComponentShowcase: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [priority, setPriority] = useState('high');
  const { toast } = useToast();

  return (
    <div className="min-h-screen bg-neutral-50 p-8">
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-neutral-900">
            MiniPGMT Design System
          </h1>
          <p className="text-lg text-neutral-600">
            Professional UI Components Showcase
          </p>
        </div>

        {/* Button Component Section */}
        <section className="bg-white rounded-lg shadow-sm p-8 space-y-6">
          <div>
            <h2 className="text-2xl font-semibold text-neutral-900 mb-2">
              Button Component
            </h2>
            <p className="text-neutral-600">
              Buttons with multiple variants, sizes, and states
            </p>
          </div>

          {/* Button Variants */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-neutral-800">Variants</h3>
            <div className="flex flex-wrap gap-4">
              <Button variant="primary">Primary Button</Button>
              <Button variant="secondary">Secondary Button</Button>
              <Button variant="destructive">Destructive</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="link">Link Button</Button>
            </div>
          </div>

          {/* Button Sizes */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-neutral-800">Sizes</h3>
            <div className="flex flex-wrap items-end gap-4">
              <Button size="sm">Small</Button>
              <Button size="md">Medium (Default)</Button>
              <Button size="lg">Large</Button>
              <Button size="icon">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Button with Icons */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-neutral-800">With Icons</h3>
            <div className="flex flex-wrap gap-4">
              <Button leftIcon={<Plus className="h-4 w-4" />}>
                Add Project
              </Button>
              <Button variant="secondary" leftIcon={<Edit className="h-4 w-4" />}>
                Edit
              </Button>
              <Button
                variant="destructive"
                leftIcon={<Trash2 className="h-4 w-4" />}
              >
                Delete
              </Button>
              <Button
                variant="outline"
                rightIcon={<Save className="h-4 w-4" />}
              >
                Save Changes
              </Button>
            </div>
          </div>

          {/* Button States */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-neutral-800">States</h3>
            <div className="flex flex-wrap gap-4">
              <Button disabled>Disabled</Button>
              <Button loading>Loading...</Button>
              <Button
                variant="destructive"
                loading
                leftIcon={<Trash2 className="h-4 w-4" />}
              >
                Deleting...
              </Button>
            </div>
          </div>

          {/* Interactive Demo */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-neutral-800">
              Interactive Demo
            </h3>
            <div className="bg-neutral-50 p-6 rounded-md space-y-4">
              <p className="text-neutral-700">
                Try interacting with these buttons to see hover, focus, and active states:
              </p>
              <div className="flex flex-wrap gap-4">
                <Button onClick={() => alert('Primary clicked!')}>
                  Click Me (Primary)
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => alert('Secondary clicked!')}
                >
                  Click Me (Secondary)
                </Button>
                <Button
                  variant="outline"
                  onClick={() => alert('Outline clicked!')}
                >
                  Click Me (Outline)
                </Button>
              </div>
              <p className="text-sm text-neutral-600">
                💡 Notice the smooth transitions and hover effects - professional UI polish!
              </p>
            </div>
          </div>
        </section>

        {/* Input Component Section */}
        <section className="bg-white rounded-lg shadow-sm p-8 space-y-6">
          <div>
            <h2 className="text-2xl font-semibold text-neutral-900 mb-2">
              Input Component
            </h2>
            <p className="text-neutral-600">
              Form inputs with labels, validation, and icons
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium text-neutral-800">Basic Inputs</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input label="Project Name" placeholder="Enter project name..." />
              <Input label="Email" type="email" placeholder="user@example.com" />
              <Input
                label="Search"
                placeholder="Search projects..."
                leftElement={<Search className="h-4 w-4" />}
              />
              <Input
                label="User Email"
                type="email"
                placeholder="Enter email"
                leftElement={<Mail className="h-4 w-4" />}
                rightElement={<Check className="h-4 w-4 text-success-main" />}
              />
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium text-neutral-800">Validation States</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Project Name"
                placeholder="Enter project name"
                error="Project name is required"
              />
              <Input
                label="Description"
                placeholder="Optional description"
                helperText="Maximum 200 characters"
              />
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium text-neutral-800">Sizes</h3>
            <div className="space-y-3">
              <Input inputSize="sm" placeholder="Small input" />
              <Input inputSize="md" placeholder="Medium input (default)" />
              <Input inputSize="lg" placeholder="Large input" />
            </div>
          </div>
        </section>

        {/* Badge Component Section */}
        <section className="bg-white rounded-lg shadow-sm p-8 space-y-6">
          <div>
            <h2 className="text-2xl font-semibold text-neutral-900 mb-2">
              Badge Component
            </h2>
            <p className="text-neutral-600">
              Priority levels, status indicators, and categorical labels
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium text-neutral-800">Priority Badges</h3>
            <div className="flex flex-wrap gap-3">
              <PriorityBadge priority="highest" />
              <PriorityBadge priority="high" />
              <PriorityBadge priority="medium" />
              <PriorityBadge priority="low" />
              <PriorityBadge priority="lowest" />
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium text-neutral-800">Status Badges</h3>
            <div className="flex flex-wrap gap-3">
              <StatusBadge status="todo" />
              <StatusBadge status="inProgress" />
              <StatusBadge status="inReview" />
              <StatusBadge status="blocked" />
              <StatusBadge status="done" />
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium text-neutral-800">Standard Variants</h3>
            <div className="flex flex-wrap gap-3">
              <Badge variant="default">Default</Badge>
              <Badge variant="primary">Primary</Badge>
              <Badge variant="success">Success</Badge>
              <Badge variant="error">Error</Badge>
              <Badge variant="warning">Warning</Badge>
              <Badge variant="info">Info</Badge>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium text-neutral-800">With Icons</h3>
            <div className="flex flex-wrap gap-3">
              <Badge variant="success" icon={<Check className="h-3 w-3" />}>
                Completed
              </Badge>
              <Badge variant="error" icon={<AlertCircle className="h-3 w-3" />}>
                Critical
              </Badge>
              <Badge variant="primary" dot>
                Active
              </Badge>
            </div>
          </div>
        </section>

        {/* Avatar Component Section */}
        <section className="bg-white rounded-lg shadow-sm p-8 space-y-6">
          <div>
            <h2 className="text-2xl font-semibold text-neutral-900 mb-2">
              Avatar Component
            </h2>
            <p className="text-neutral-600">
              User avatars with status indicators and groups
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium text-neutral-800">Sizes</h3>
            <div className="flex flex-wrap items-end gap-4">
              <Avatar size="sm" fallback="SM" />
              <Avatar size="md" fallback="MD" />
              <Avatar size="lg" fallback="LG" />
              <Avatar size="xl" fallback="XL" />
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium text-neutral-800">With Names</h3>
            <div className="flex flex-wrap gap-4">
              <Avatar alt="John Doe" />
              <Avatar alt="Sarah Smith" />
              <Avatar alt="Mike Johnson" />
              <Avatar alt="Emily Brown" />
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium text-neutral-800">Status Indicators</h3>
            <div className="flex flex-wrap gap-4">
              <Avatar alt="Online User" status="online" />
              <Avatar alt="Away User" status="away" />
              <Avatar alt="Busy User" status="busy" />
              <Avatar alt="Offline User" status="offline" />
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium text-neutral-800">Avatar Group</h3>
            <AvatarGroup
              max={4}
              avatars={[
                { alt: "John Doe" },
                { alt: "Sarah Smith" },
                { alt: "Mike Johnson" },
                { alt: "Emily Brown" },
                { alt: "David Lee" },
                { alt: "Anna Wilson" },
              ]}
            />
          </div>
        </section>

        {/* Card Component Section */}
        <section className="bg-white rounded-lg shadow-sm p-8 space-y-6">
          <div>
            <h2 className="text-2xl font-semibold text-neutral-900 mb-2">
              Card Component
            </h2>
            <p className="text-neutral-600">
              Versatile containers for content organization
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium text-neutral-800">Card Variants</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card variant="default">
                <CardHeader>
                  <CardTitle>Default Card</CardTitle>
                  <CardDescription>With subtle shadow</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-neutral-600">
                    This is the default card variant with a subtle shadow and border.
                  </p>
                </CardContent>
              </Card>

              <Card variant="elevated">
                <CardHeader>
                  <CardTitle>Elevated Card</CardTitle>
                  <CardDescription>More prominent shadow</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-neutral-600">
                    This card has a more pronounced elevation for emphasis.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium text-neutral-800">Interactive Card</h3>
            <Card hoverable variant="default">
              <CardHeader>
                <CardTitle>Project Health Dashboard</CardTitle>
                <CardDescription>Click to view details</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-neutral-600">Progress</span>
                    <span className="text-sm font-medium">75%</span>
                  </div>
                  <div className="w-full bg-neutral-200 rounded-full h-2">
                    <div className="bg-primary-500 h-2 rounded-full" style={{ width: '75%' }} />
                  </div>
                  <div className="flex gap-2 mt-3">
                    <StatusBadge status="inProgress" />
                    <PriorityBadge priority="high" />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="justify-between">
                <AvatarGroup
                  size="sm"
                  max={3}
                  avatars={[
                    { alt: "Team Member 1" },
                    { alt: "Team Member 2" },
                    { alt: "Team Member 3" },
                  ]}
                />
                <Button variant="ghost" size="sm">View Project</Button>
              </CardFooter>
            </Card>
          </div>
        </section>

        {/* Modal Component Section */}
        <section className="bg-white rounded-lg shadow-sm p-8 space-y-6">
          <div>
            <h2 className="text-2xl font-semibold text-neutral-900 mb-2">
              Modal Component
            </h2>
            <p className="text-neutral-600">
              Accessible dialogs with overlay and animations
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium text-neutral-800">Basic Modal</h3>
            <Modal open={isModalOpen} onOpenChange={setIsModalOpen}>
              <ModalTrigger asChild>
                <Button>Open Modal</Button>
              </ModalTrigger>
              <ModalContent>
                <ModalHeader>
                  <ModalTitle>Create New Project</ModalTitle>
                  <ModalDescription>
                    Add a new project to your workspace. Fill in the details below.
                  </ModalDescription>
                </ModalHeader>
                <ModalBody>
                  <div className="space-y-4">
                    <Input label="Project Name" placeholder="Enter project name" />
                    <Input label="Description" placeholder="Project description" />
                    <Select value={priority} onValueChange={setPriority}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select priority" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="highest">Highest</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="low">Low</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </ModalBody>
                <ModalFooter>
                  <Button variant="outline" onClick={() => setIsModalOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={() => setIsModalOpen(false)}>Create Project</Button>
                </ModalFooter>
              </ModalContent>
            </Modal>
          </div>
        </section>

        {/* Select Component Section */}
        <section className="bg-white rounded-lg shadow-sm p-8 space-y-6">
          <div>
            <h2 className="text-2xl font-semibold text-neutral-900 mb-2">
              Select Component
            </h2>
            <p className="text-neutral-600">
              Dropdown select with keyboard navigation
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium text-neutral-800">Priority Selector</h3>
            <div className="max-w-xs">
              <Select value={priority} onValueChange={setPriority}>
                <SelectTrigger>
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="highest">🔴 Highest</SelectItem>
                  <SelectItem value="high">🟠 High</SelectItem>
                  <SelectItem value="medium">🟡 Medium</SelectItem>
                  <SelectItem value="low">🟢 Low</SelectItem>
                  <SelectItem value="lowest">🔵 Lowest</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-sm text-neutral-600 mt-2">
                Selected: <PriorityBadge priority={priority as any} />
              </p>
            </div>
          </div>
        </section>

        {/* Progress Component Section */}
        <section className="bg-white rounded-lg shadow-sm p-8 space-y-6">
          <div>
            <h2 className="text-2xl font-semibold text-neutral-900 mb-2">
              Progress Component
            </h2>
            <p className="text-neutral-600">
              Visual progress indicators
            </p>
          </div>

          <div className="space-y-6">
            <div className="space-y-3">
              <h3 className="text-lg font-medium text-neutral-800">Variants</h3>
              <Progress value={75} variant="default" showLabel />
              <Progress value={100} variant="success" showLabel />
              <Progress value={45} variant="warning" showLabel />
              <Progress value={15} variant="error" showLabel />
            </div>

            <div className="space-y-3">
              <h3 className="text-lg font-medium text-neutral-800">Sizes</h3>
              <Progress value={60} size="sm" />
              <Progress value={60} size="md" />
              <Progress value={60} size="lg" />
            </div>
          </div>
        </section>

        {/* Tooltip Component Section */}
        <section className="bg-white rounded-lg shadow-sm p-8 space-y-6">
          <div>
            <h2 className="text-2xl font-semibold text-neutral-900 mb-2">
              Tooltip Component
            </h2>
            <p className="text-neutral-600">
              Contextual information on hover
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium text-neutral-800">Examples</h3>
            <div className="flex gap-4 items-center">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="icon">
                    <HelpCircle className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Need help? Click for documentation</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button>Hover me</Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>This is a helpful tooltip!</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <StatusBadge status="inProgress" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Task is currently being worked on</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </div>
        </section>

        {/* Toast Component Section */}
        <section className="bg-white rounded-lg shadow-sm p-8 space-y-6">
          <div>
            <h2 className="text-2xl font-semibold text-neutral-900 mb-2">
              Toast Component
            </h2>
            <p className="text-neutral-600">
              Temporary notification messages
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium text-neutral-800">Try Toasts</h3>
            <div className="flex flex-wrap gap-3">
              <Button
                onClick={() =>
                  toast({
                    title: 'Success!',
                    description: 'Your project was created successfully.',
                    variant: 'success',
                  })
                }
                variant="outline"
              >
                Success Toast
              </Button>
              <Button
                onClick={() =>
                  toast({
                    title: 'Error',
                    description: 'Something went wrong. Please try again.',
                    variant: 'error',
                  })
                }
                variant="outline"
              >
                Error Toast
              </Button>
              <Button
                onClick={() =>
                  toast({
                    title: 'Warning',
                    description: 'This action cannot be undone.',
                    variant: 'warning',
                  })
                }
                variant="outline"
              >
                Warning Toast
              </Button>
              <Button
                onClick={() =>
                  toast({
                    title: 'Info',
                    description: 'New updates are available.',
                    variant: 'info',
                  })
                }
                variant="outline"
              >
                Info Toast
              </Button>
            </div>
          </div>
        </section>

        {/* Coming Soon Section */}
        <section className="bg-white rounded-lg shadow-sm p-8">
          <h2 className="text-2xl font-semibold text-neutral-900 mb-4">
            Coming Soon
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {['Tabs', 'Accordion', 'Table', 'Form', 'Checkbox', 'Radio', 'Switch', 'Textarea'].map((component) => (
              <div
                key={component}
                className="bg-neutral-50 p-4 rounded-md text-center text-neutral-600 border-2 border-dashed border-neutral-300"
              >
                {component}
              </div>
            ))}
          </div>
        </section>

        {/* Footer */}
        <footer className="text-center text-neutral-600 text-sm py-6">
          <p>
            MiniPGMT Design System • Built with React + TypeScript + Tailwind CSS
          </p>
          <p className="mt-2">
            Design tokens ensure consistency across the entire application
          </p>
        </footer>
      </div>
    </div>
  );
};

export default ComponentShowcase;
