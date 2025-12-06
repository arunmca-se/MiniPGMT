import * as React from 'react';
import { Avatar } from '../../design-system/primitives/Avatar';
import { Badge } from '../../design-system/primitives/Badge';
import { Button } from '../../design-system/primitives/Button';
import { Card, CardContent } from '../../design-system/primitives/Card';
import { Input } from '../../design-system/primitives/Input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../design-system/primitives/Select';
import { Search, UserPlus, Mail, MoreVertical, Filter } from 'lucide-react';
import { mockUsers, mockIssues } from '../../mocks/data';

/**
 * Team Directory Page
 *
 * Shows all team members with their workload and assigned issues.
 * Features: Search, filter by role, view workload stats
 */

type RoleFilter = 'all' | 'admin' | 'member' | 'viewer';

export const Team: React.FC = () => {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [roleFilter, setRoleFilter] = React.useState<RoleFilter>('all');

  // Calculate workload for each user
  const teamMembersWithWorkload = React.useMemo(() => {
    return mockUsers.map((user) => {
      const assignedIssues = mockIssues.filter((issue) => issue.assignee?.id === user.id);
      const completedIssues = assignedIssues.filter((issue) => issue.status === 'done');
      const inProgressIssues = assignedIssues.filter((issue) => issue.status === 'inProgress');
      const todoIssues = assignedIssues.filter((issue) => issue.status === 'todo');

      return {
        ...user,
        workload: {
          total: assignedIssues.length,
          completed: completedIssues.length,
          inProgress: inProgressIssues.length,
          todo: todoIssues.length,
          completionRate:
            assignedIssues.length > 0
              ? Math.round((completedIssues.length / assignedIssues.length) * 100)
              : 0,
        },
      };
    });
  }, []);

  // Filter team members
  const filteredTeamMembers = React.useMemo(() => {
    return teamMembersWithWorkload.filter((member) => {
      const matchesSearch =
        member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        member.email.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesRole = roleFilter === 'all' || member.role === roleFilter;
      return matchesSearch && matchesRole;
    });
  }, [teamMembersWithWorkload, searchQuery, roleFilter]);

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'admin':
        return 'destructive' as const;
      case 'member':
        return 'default' as const;
      case 'viewer':
        return 'secondary' as const;
      default:
        return 'default' as const;
    }
  };

  const getWorkloadColor = (total: number) => {
    if (total >= 10) return 'text-red-600';
    if (total >= 5) return 'text-orange-600';
    return 'text-green-600';
  };

  return (
    <div className="flex h-full flex-col bg-neutral-50">
      {/* Header */}
      <div className="border-b border-neutral-200 bg-white px-6 py-4">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold text-neutral-900">Team Directory</h1>
            <p className="text-sm text-neutral-600">
              Manage team members and view their workload
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button size="sm" leftIcon={<UserPlus className="h-4 w-4" />}>
              Invite Member
            </Button>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="border-b border-neutral-200 bg-white px-6 py-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
            <Input
              type="text"
              placeholder="Search team members..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <Select value={roleFilter} onValueChange={(value) => setRoleFilter(value as RoleFilter)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
              <SelectItem value="member">Member</SelectItem>
              <SelectItem value="viewer">Viewer</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Team Stats */}
      <div className="border-b border-neutral-200 bg-white px-6 py-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-lg bg-neutral-50 p-4">
            <p className="text-sm font-medium text-neutral-600">Total Members</p>
            <p className="mt-2 text-3xl font-bold text-neutral-900">{mockUsers.length}</p>
          </div>
          <div className="rounded-lg bg-neutral-50 p-4">
            <p className="text-sm font-medium text-neutral-600">Admins</p>
            <p className="mt-2 text-3xl font-bold text-neutral-900">
              {mockUsers.filter((u) => u.role === 'admin').length}
            </p>
          </div>
          <div className="rounded-lg bg-neutral-50 p-4">
            <p className="text-sm font-medium text-neutral-600">Active Issues</p>
            <p className="mt-2 text-3xl font-bold text-neutral-900">
              {mockIssues.filter((i) => i.status !== 'done').length}
            </p>
          </div>
          <div className="rounded-lg bg-neutral-50 p-4">
            <p className="text-sm font-medium text-neutral-600">Avg Workload</p>
            <p className="mt-2 text-3xl font-bold text-neutral-900">
              {Math.round(
                teamMembersWithWorkload.reduce((sum, m) => sum + m.workload.total, 0) /
                  teamMembersWithWorkload.length
              )}
            </p>
          </div>
        </div>
      </div>

      {/* Team Members List */}
      <div className="flex-1 overflow-auto p-6">
        {filteredTeamMembers.length === 0 ? (
          <div className="flex h-full items-center justify-center">
            <div className="text-center">
              <p className="text-lg font-semibold text-neutral-900">No team members found</p>
              <p className="mt-2 text-sm text-neutral-600">
                Try adjusting your search or filters
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-3">
            {filteredTeamMembers.map((member) => (
              <Card key={member.id} hoverable className="group">
                <CardContent className="p-6">
                  {/* Header */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar src={member.avatar} alt={member.name} size="lg" />
                      <div>
                        <h3 className="font-semibold text-neutral-900">{member.name}</h3>
                        <p className="text-sm text-neutral-600">{member.email}</p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="opacity-0 transition-opacity group-hover:opacity-100"
                    >
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* Role Badge */}
                  <div className="mt-4">
                    <Badge variant={getRoleBadgeVariant(member.role)} size="sm">
                      {member.role.toUpperCase()}
                    </Badge>
                  </div>

                  {/* Workload Stats */}
                  <div className="mt-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-neutral-600">Total Issues</span>
                      <span
                        className={`text-sm font-semibold ${getWorkloadColor(
                          member.workload.total
                        )}`}
                      >
                        {member.workload.total}
                      </span>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-xs text-neutral-600">
                        <span>Completion Rate</span>
                        <span className="font-medium">{member.workload.completionRate}%</span>
                      </div>
                      <div className="h-2 w-full overflow-hidden rounded-full bg-neutral-200">
                        <div
                          className="h-full rounded-full bg-primary-500 transition-all"
                          style={{ width: `${member.workload.completionRate}%` }}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div className="rounded-md bg-neutral-50 p-2">
                        <p className="text-xs text-neutral-600">To Do</p>
                        <p className="text-sm font-semibold text-neutral-900">
                          {member.workload.todo}
                        </p>
                      </div>
                      <div className="rounded-md bg-primary-50 p-2">
                        <p className="text-xs text-neutral-600">In Progress</p>
                        <p className="text-sm font-semibold text-primary-700">
                          {member.workload.inProgress}
                        </p>
                      </div>
                      <div className="rounded-md bg-success-light p-2">
                        <p className="text-xs text-neutral-600">Done</p>
                        <p className="text-sm font-semibold text-success-dark">
                          {member.workload.completed}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="mt-4 flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      leftIcon={<Mail className="h-4 w-4" />}
                    >
                      Message
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Team;
