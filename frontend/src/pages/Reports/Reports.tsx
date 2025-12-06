import * as React from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Card, CardHeader, CardTitle, CardContent } from '../../design-system/primitives/Card';
import { Badge } from '../../design-system/primitives/Badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../design-system/primitives/Select';
import { Button } from '../../design-system/primitives/Button';
import { TrendingUp, TrendingDown, Download, Calendar } from 'lucide-react';
import { mockProjects, mockIssues } from '../../mocks/data';

/**
 * Reports Page
 *
 * Comprehensive reports with charts and visualizations.
 * Features: Burndown chart, Velocity chart, Issue distribution, Team performance
 */

// Mock data for charts
const burndownData = [
  { day: 'Day 1', ideal: 100, actual: 100 },
  { day: 'Day 2', ideal: 90, actual: 95 },
  { day: 'Day 3', ideal: 80, actual: 88 },
  { day: 'Day 4', ideal: 70, actual: 78 },
  { day: 'Day 5', ideal: 60, actual: 65 },
  { day: 'Day 6', ideal: 50, actual: 52 },
  { day: 'Day 7', ideal: 40, actual: 45 },
  { day: 'Day 8', ideal: 30, actual: 35 },
  { day: 'Day 9', ideal: 20, actual: 22 },
  { day: 'Day 10', ideal: 10, actual: 12 },
  { day: 'Day 11', ideal: 0, actual: 5 },
];

const velocityData = [
  { sprint: 'Sprint 1', planned: 42, completed: 38 },
  { sprint: 'Sprint 2', planned: 45, completed: 45 },
  { sprint: 'Sprint 3', planned: 50, completed: 42 },
  { sprint: 'Sprint 4', planned: 48, completed: 48 },
  { sprint: 'Sprint 5', planned: 52, completed: 50 },
  { sprint: 'Sprint 6', planned: 55, completed: 52 },
];

const issueTypeData = [
  { name: 'Stories', value: 45, color: '#4CAF50' },
  { name: 'Tasks', value: 32, color: '#2196F3' },
  { name: 'Bugs', value: 18, color: '#F44336' },
  { name: 'Epics', value: 8, color: '#9C27B0' },
  { name: 'Subtasks', value: 12, color: '#9E9E9E' },
];

const cumulativeFlowData = [
  { date: 'Week 1', todo: 40, inProgress: 10, inReview: 5, done: 5 },
  { date: 'Week 2', todo: 35, inProgress: 15, inReview: 8, done: 12 },
  { date: 'Week 3', todo: 28, inProgress: 18, inReview: 10, done: 24 },
  { date: 'Week 4', todo: 22, inProgress: 20, inReview: 8, done: 30 },
  { date: 'Week 5', todo: 15, inProgress: 15, inReview: 12, done: 38 },
  { date: 'Week 6', todo: 10, inProgress: 12, inReview: 8, done: 50 },
];

const cycleTimeData = [
  { week: 'Week 1', avgCycleTime: 5.2 },
  { week: 'Week 2', avgCycleTime: 4.8 },
  { week: 'Week 3', avgCycleTime: 6.1 },
  { week: 'Week 4', avgCycleTime: 4.5 },
  { week: 'Week 5', avgCycleTime: 5.0 },
  { week: 'Week 6', avgCycleTime: 4.2 },
];

export const Reports: React.FC = () => {
  const [selectedProject, setSelectedProject] = React.useState('all');
  const [timeRange, setTimeRange] = React.useState('30d');

  // Calculate summary stats
  const totalIssues = mockIssues.length;
  const completedIssues = mockIssues.filter((i) => i.status === 'done').length;
  const completionRate = Math.round((completedIssues / totalIssues) * 100);
  const avgVelocity = Math.round(
    velocityData.reduce((sum, s) => sum + s.completed, 0) / velocityData.length
  );

  return (
    <div className="flex h-full flex-col bg-neutral-50">
      {/* Header */}
      <div className="border-b border-neutral-200 bg-white px-6 py-4">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold text-neutral-900">Reports & Analytics</h1>
            <p className="text-sm text-neutral-600">
              Track team performance and project progress
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Select value={selectedProject} onValueChange={setSelectedProject}>
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Projects</SelectItem>
                {mockProjects.map((project) => (
                  <SelectItem key={project.key} value={project.key}>
                    {project.key}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-[150px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="90d">Last 90 days</SelectItem>
                <SelectItem value="all">All time</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline" size="sm" leftIcon={<Download className="h-4 w-4" />}>
              Export
            </Button>
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="border-b border-neutral-200 bg-white px-6 py-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-lg bg-gradient-to-br from-primary-50 to-primary-100 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-primary-700">Completion Rate</p>
                <p className="mt-2 text-3xl font-bold text-primary-900">{completionRate}%</p>
              </div>
              <TrendingUp className="h-8 w-8 text-primary-600" />
            </div>
            <p className="mt-2 text-xs text-primary-700">
              {completedIssues} of {totalIssues} issues completed
            </p>
          </div>

          <div className="rounded-lg bg-gradient-to-br from-green-50 to-green-100 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-700">Avg Velocity</p>
                <p className="mt-2 text-3xl font-bold text-green-900">{avgVelocity}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
            <p className="mt-2 text-xs text-green-700">Story points per sprint</p>
          </div>

          <div className="rounded-lg bg-gradient-to-br from-purple-50 to-purple-100 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-700">Avg Cycle Time</p>
                <p className="mt-2 text-3xl font-bold text-purple-900">4.8d</p>
              </div>
              <TrendingDown className="h-8 w-8 text-purple-600" />
            </div>
            <p className="mt-2 text-xs text-purple-700">Time from start to done</p>
          </div>

          <div className="rounded-lg bg-gradient-to-br from-orange-50 to-orange-100 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-700">Active Sprints</p>
                <p className="mt-2 text-3xl font-bold text-orange-900">2</p>
              </div>
              <Calendar className="h-8 w-8 text-orange-600" />
            </div>
            <p className="mt-2 text-xs text-orange-700">Currently in progress</p>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="flex-1 overflow-auto p-6">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Burndown Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Sprint Burndown</span>
                <Badge variant="default" size="sm">
                  Current Sprint
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={burndownData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                  <XAxis dataKey="day" stroke="#757575" fontSize={12} />
                  <YAxis stroke="#757575" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#fff',
                      border: '1px solid #e0e0e0',
                      borderRadius: '8px',
                    }}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="ideal"
                    stroke="#9e9e9e"
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    name="Ideal"
                  />
                  <Line
                    type="monotone"
                    dataKey="actual"
                    stroke="#2196f3"
                    strokeWidth={2}
                    name="Actual"
                  />
                </LineChart>
              </ResponsiveContainer>
              <p className="mt-4 text-xs text-neutral-600">
                Tracks remaining work over sprint duration. Actual line shows real progress vs
                ideal burn rate.
              </p>
            </CardContent>
          </Card>

          {/* Velocity Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Team Velocity</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={velocityData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                  <XAxis dataKey="sprint" stroke="#757575" fontSize={12} />
                  <YAxis stroke="#757575" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#fff',
                      border: '1px solid #e0e0e0',
                      borderRadius: '8px',
                    }}
                  />
                  <Legend />
                  <Bar dataKey="planned" fill="#e3f2fd" name="Planned" />
                  <Bar dataKey="completed" fill="#2196f3" name="Completed" />
                </BarChart>
              </ResponsiveContainer>
              <p className="mt-4 text-xs text-neutral-600">
                Story points planned vs completed per sprint. Helps predict capacity for future
                sprints.
              </p>
            </CardContent>
          </Card>

          {/* Issue Type Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Issue Type Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={issueTypeData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {issueTypeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#fff',
                      border: '1px solid #e0e0e0',
                      borderRadius: '8px',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="mt-4 grid grid-cols-2 gap-2">
                {issueTypeData.map((type) => (
                  <div key={type.name} className="flex items-center gap-2 text-sm">
                    <div
                      className="h-3 w-3 rounded-sm"
                      style={{ backgroundColor: type.color }}
                    />
                    <span className="text-neutral-700">
                      {type.name}: {type.value}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Cumulative Flow Diagram */}
          <Card>
            <CardHeader>
              <CardTitle>Cumulative Flow</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={cumulativeFlowData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                  <XAxis dataKey="date" stroke="#757575" fontSize={12} />
                  <YAxis stroke="#757575" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#fff',
                      border: '1px solid #e0e0e0',
                      borderRadius: '8px',
                    }}
                  />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="todo"
                    stackId="1"
                    stroke="#9e9e9e"
                    fill="#f5f5f5"
                    name="To Do"
                  />
                  <Area
                    type="monotone"
                    dataKey="inProgress"
                    stackId="1"
                    stroke="#2196f3"
                    fill="#bbdefb"
                    name="In Progress"
                  />
                  <Area
                    type="monotone"
                    dataKey="inReview"
                    stackId="1"
                    stroke="#9c27b0"
                    fill="#e1bee7"
                    name="In Review"
                  />
                  <Area
                    type="monotone"
                    dataKey="done"
                    stackId="1"
                    stroke="#4caf50"
                    fill="#c8e6c9"
                    name="Done"
                  />
                </AreaChart>
              </ResponsiveContainer>
              <p className="mt-4 text-xs text-neutral-600">
                Shows work item distribution across workflow states over time. Identifies
                bottlenecks.
              </p>
            </CardContent>
          </Card>

          {/* Cycle Time Trend */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Average Cycle Time Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={cycleTimeData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                  <XAxis dataKey="week" stroke="#757575" fontSize={12} />
                  <YAxis stroke="#757575" fontSize={12} label={{ value: 'Days', angle: -90 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#fff',
                      border: '1px solid #e0e0e0',
                      borderRadius: '8px',
                    }}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="avgCycleTime"
                    stroke="#ff9800"
                    strokeWidth={3}
                    name="Avg Cycle Time"
                    dot={{ fill: '#ff9800', r: 5 }}
                  />
                </LineChart>
              </ResponsiveContainer>
              <p className="mt-4 text-xs text-neutral-600">
                Average time from "In Progress" to "Done" status. Lower is better. Target: &lt; 5
                days.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Reports;
