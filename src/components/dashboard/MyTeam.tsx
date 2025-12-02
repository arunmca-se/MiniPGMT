import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { MessageCircle, UserPlus } from 'lucide-react';
import { Button } from '../ui/button';

interface TeamMember {
  id: string;
  name: string;
  role: string;
  avatar?: string;
  isOnline: boolean;
}

// Sample team data (would come from API in real app)
const teamMembers: TeamMember[] = [
  { id: '1', name: 'David K.', role: 'Frontend Dev', isOnline: true },
  { id: '2', name: 'Sarah M.', role: 'UX Designer', isOnline: true },
  { id: '3', name: 'James L.', role: 'Backend Lead', isOnline: false },
];

const getAvatarColors = (id: string) => {
  const colors = [
    'from-sky-400 to-blue-600',
    'from-pink-400 to-rose-600',
    'from-green-400 to-emerald-600',
    'from-purple-400 to-violet-600',
    'from-orange-400 to-red-600',
  ];
  const index = id.charCodeAt(0) % colors.length;
  return colors[index];
};

export function MyTeam() {
  return (
    <Card className="bg-white border border-gray-100">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold text-gray-900">My Team</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {teamMembers.map((member) => (
          <div
            key={member.id}
            className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors"
          >
            {/* Avatar with online status */}
            <div className="relative">
              <div
                className={`w-10 h-10 bg-gradient-to-br ${getAvatarColors(member.id)} rounded-full flex items-center justify-center text-white font-medium text-sm`}
              >
                {member.name.split(' ').map(n => n[0]).join('')}
              </div>
              {member.isOnline && (
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
              )}
            </div>

            {/* Member Info */}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900">{member.name}</p>
              <p className="text-xs text-gray-500">{member.role}</p>
            </div>

            {/* Message Button */}
            <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
              <MessageCircle className="w-4 h-4" />
            </button>
          </div>
        ))}

        {/* Invite Button */}
        <Button
          variant="outline"
          className="w-full mt-3 border-dashed border-gray-300 text-gray-500 hover:text-gray-700 hover:border-gray-400"
        >
          <UserPlus className="w-4 h-4 mr-2" />
          Invite Member
        </Button>
      </CardContent>
    </Card>
  );
}
