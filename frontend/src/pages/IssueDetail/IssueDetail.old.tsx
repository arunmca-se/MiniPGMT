import * as React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  MoreHorizontal,
  Paperclip,
  Clock,
  MessageSquare,
  Link as LinkIcon,
  Trash2,
  Edit,
} from 'lucide-react';
import { Button } from '../../design-system/primitives/Button';
import { Input } from '../../design-system/primitives/Input';
import { Avatar } from '../../design-system/primitives/Avatar';
import { Badge, PriorityBadge, StatusBadge } from '../../design-system/primitives/Badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../design-system/primitives/Select';
import { Card, CardHeader, CardTitle, CardContent } from '../../design-system/primitives/Card';
import { RichTextEditor } from '../../design-system/primitives/RichTextEditor';
import { mockIssues, mockUsers, type Issue } from '../../mocks/data';
import { formatDistanceToNow } from '../Dashboard/utils';

/**
 * Issue Detail Page
 *
 * Full CRUD page for viewing and editing issue details.
 * Includes: Description, Comments, Subtasks, Time tracking, Attachments, Activity log
 */

interface Comment {
  id: string;
  author: typeof mockUsers[0];
  content: string;
  createdAt: string;
}

export const IssueDetail: React.FC = () => {
  const { issueKey } = useParams<{ issueKey: string }>();
  const navigate = useNavigate();

  // Find the issue from mock data
  const issue = mockIssues.find((i) => i.key === issueKey);

  const [description, setDescription] = React.useState(
    issue?.description || 'No description provided.'
  );
  const [isEditingDescription, setIsEditingDescription] = React.useState(false);
  const [newComment, setNewComment] = React.useState('');

  // Mock comments
  const [comments, setComments] = React.useState<Comment[]>([
    {
      id: '1',
      author: mockUsers[1],
      content: 'I\'ve started working on this. Should have it done by end of day.',
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: '2',
      author: mockUsers[0],
      content: 'Great! Let me know if you need any help with the implementation.',
      createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    },
  ]);

  if (!issue) {
    return (
      <div className="flex h-full items-center justify-center p-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-neutral-900">Issue not found</h2>
          <p className="mt-2 text-neutral-600">
            The issue <span className="font-mono">{issueKey}</span> doesn't exist.
          </p>
          <Button className="mt-4" onClick={() => navigate('/board')}>
            Go to Board
          </Button>
        </div>
      </div>
    );
  }

  const handleAddComment = () => {
    if (newComment.trim()) {
      const comment: Comment = {
        id: Date.now().toString(),
        author: mockUsers[0], // Current user
        content: newComment,
        createdAt: new Date().toISOString(),
      };
      setComments([...comments, comment]);
      setNewComment('');
    }
  };

  const issueTypeIcons: Record<string, string> = {
    epic: '⚡',
    story: '📄',
    task: '✓',
    bug: '🐛',
    subtask: '◻',
  };

  return (
    <div className="flex h-full flex-col bg-neutral-50">
      {/* Header */}
      <div className="border-b border-neutral-200 bg-white px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate(-1)}
              className="hover:bg-neutral-100"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex items-center gap-2">
              <span className="text-lg font-mono font-semibold text-neutral-600">
                {issue.key}
              </span>
              <Badge variant="default" size="sm">
                {issueTypeIcons[issue.type]} {issue.type.toUpperCase()}
              </Badge>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" leftIcon={<LinkIcon className="h-4 w-4" />}>
              Link Issue
            </Button>
            <Button variant="outline" size="sm" leftIcon={<Edit className="h-4 w-4" />}>
              Edit
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="hover:bg-neutral-100"
            >
              <MoreHorizontal className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="mx-auto max-w-7xl px-6 py-6">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* Left Column - Main Content */}
            <div className="space-y-6 lg:col-span-2">
              {/* Title */}
              <div>
                <h1 className="text-3xl font-bold text-neutral-900">{issue.title}</h1>
              </div>

              {/* Description */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">Description</CardTitle>
                    {!isEditingDescription && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setIsEditingDescription(true)}
                      >
                        Edit
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  {isEditingDescription ? (
                    <div className="space-y-3">
                      <RichTextEditor
                        content={description}
                        onChange={(content) => setDescription(content)}
                        placeholder="Describe the issue in detail..."
                        minHeight="250px"
                      />
                      <div className="flex gap-2">
                        <Button size="sm" onClick={() => setIsEditingDescription(false)}>
                          Save
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setDescription(issue.description || '');
                            setIsEditingDescription(false);
                          }}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="prose prose-sm max-w-none">
                      <div dangerouslySetInnerHTML={{ __html: description }} />
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Comments */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <MessageSquare className="h-5 w-5" />
                    Comments ({comments.length})
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Add Comment */}
                  <div className="flex gap-3">
                    <Avatar
                      src={mockUsers[0].avatar}
                      alt={mockUsers[0].name}
                      size="sm"
                    />
                    <div className="flex-1 space-y-2">
                      <textarea
                        className="w-full min-h-[100px] rounded-md border border-neutral-300 p-3 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
                        placeholder="Add a comment..."
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                      />
                      <Button size="sm" onClick={handleAddComment} disabled={!newComment.trim()}>
                        Comment
                      </Button>
                    </div>
                  </div>

                  {/* Comments List */}
                  {comments.length > 0 && (
                    <div className="space-y-4 border-t border-neutral-200 pt-4">
                      {comments.map((comment) => (
                        <div key={comment.id} className="flex gap-3">
                          <Avatar
                            src={comment.author.avatar}
                            alt={comment.author.name}
                            size="sm"
                          />
                          <div className="flex-1 space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-semibold text-neutral-900">
                                {comment.author.name}
                              </span>
                              <span className="text-xs text-neutral-500">
                                {formatDistanceToNow(new Date(comment.createdAt))}
                              </span>
                            </div>
                            <p className="text-sm text-neutral-700">{comment.content}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Activity */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex gap-3 text-sm">
                      <Avatar src={issue.reporter.avatar} alt={issue.reporter.name} size="sm" />
                      <div className="flex-1">
                        <p className="text-neutral-700">
                          <span className="font-semibold">{issue.reporter.name}</span> created this
                          issue
                        </p>
                        <p className="text-xs text-neutral-500">
                          {formatDistanceToNow(new Date(issue.createdAt))}
                        </p>
                      </div>
                    </div>

                    {issue.assignee && (
                      <div className="flex gap-3 text-sm">
                        <Avatar src={issue.reporter.avatar} alt={issue.reporter.name} size="sm" />
                        <div className="flex-1">
                          <p className="text-neutral-700">
                            <span className="font-semibold">{issue.reporter.name}</span> assigned
                            this to <span className="font-semibold">{issue.assignee.name}</span>
                          </p>
                          <p className="text-xs text-neutral-500">
                            {formatDistanceToNow(new Date(issue.updatedAt))}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Metadata */}
            <div className="space-y-6">
              {/* Details Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Status */}
                  <div>
                    <label className="text-xs font-medium text-neutral-600 uppercase">
                      Status
                    </label>
                    <div className="mt-1">
                      <StatusBadge status={issue.status} />
                    </div>
                  </div>

                  {/* Priority */}
                  <div>
                    <label className="text-xs font-medium text-neutral-600 uppercase">
                      Priority
                    </label>
                    <div className="mt-1">
                      <PriorityBadge priority={issue.priority} />
                    </div>
                  </div>

                  {/* Assignee */}
                  <div>
                    <label className="text-xs font-medium text-neutral-600 uppercase">
                      Assignee
                    </label>
                    <div className="mt-2">
                      {issue.assignee ? (
                        <div className="flex items-center gap-2">
                          <Avatar
                            src={issue.assignee.avatar}
                            alt={issue.assignee.name}
                            size="sm"
                          />
                          <span className="text-sm text-neutral-900">
                            {issue.assignee.name}
                          </span>
                        </div>
                      ) : (
                        <span className="text-sm text-neutral-500">Unassigned</span>
                      )}
                    </div>
                  </div>

                  {/* Reporter */}
                  <div>
                    <label className="text-xs font-medium text-neutral-600 uppercase">
                      Reporter
                    </label>
                    <div className="mt-2 flex items-center gap-2">
                      <Avatar
                        src={issue.reporter.avatar}
                        alt={issue.reporter.name}
                        size="sm"
                      />
                      <span className="text-sm text-neutral-900">{issue.reporter.name}</span>
                    </div>
                  </div>

                  {/* Story Points */}
                  {issue.storyPoints && (
                    <div>
                      <label className="text-xs font-medium text-neutral-600 uppercase">
                        Story Points
                      </label>
                      <div className="mt-1">
                        <Badge variant="default">{issue.storyPoints}</Badge>
                      </div>
                    </div>
                  )}

                  {/* Due Date */}
                  {issue.dueDate && (
                    <div>
                      <label className="text-xs font-medium text-neutral-600 uppercase">
                        Due Date
                      </label>
                      <div className="mt-1">
                        <span className="text-sm text-neutral-900">{issue.dueDate}</span>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Time Tracking */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Time Tracking
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-neutral-600">Estimated:</span>
                    <span className="font-medium text-neutral-900">8h</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-neutral-600">Logged:</span>
                    <span className="font-medium text-neutral-900">5h 30m</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-neutral-600">Remaining:</span>
                    <span className="font-medium text-neutral-900">2h 30m</span>
                  </div>
                  <Button variant="outline" size="sm" className="w-full" leftIcon={<Clock className="h-4 w-4" />}>
                    Log Time
                  </Button>
                </CardContent>
              </Card>

              {/* Attachments */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Paperclip className="h-5 w-5" />
                    Attachments ({issue.attachmentCount})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" size="sm" className="w-full" leftIcon={<Paperclip className="h-4 w-4" />}>
                    Add Attachment
                  </Button>
                </CardContent>
              </Card>

              {/* Actions */}
              <Card>
                <CardContent className="pt-6">
                  <Button
                    variant="destructive"
                    size="sm"
                    className="w-full"
                    leftIcon={<Trash2 className="h-4 w-4" />}
                  >
                    Delete Issue
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IssueDetail;
