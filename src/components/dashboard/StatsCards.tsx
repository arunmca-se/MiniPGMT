import { ListTodo, CheckCircle2, Bug, Clock } from 'lucide-react';
import { Card } from '../ui/card';

interface StatCardProps {
  icon: React.ReactNode;
  iconBg: string;
  value: number | string;
  label: string;
  trend?: number;
  trendLabel?: string;
  suffix?: string;
}

function StatCard({ icon, iconBg, value, label, trend, trendLabel, suffix }: StatCardProps) {
  const isPositiveTrend = trend && trend > 0;
  const isNegativeTrend = trend && trend < 0;

  return (
    <Card className="p-5 bg-white border border-gray-100 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${iconBg}`}>
          {icon}
        </div>
        {trend !== undefined && (
          <span
            className={`text-xs font-medium px-2 py-0.5 rounded-full ${
              isPositiveTrend
                ? 'bg-green-50 text-green-600'
                : isNegativeTrend
                ? 'bg-red-50 text-red-600'
                : 'bg-gray-50 text-gray-600'
            }`}
          >
            {isPositiveTrend ? '+' : ''}{trend}%
          </span>
        )}
        {trendLabel && (
          <span className="text-xs text-gray-400">{trendLabel}</span>
        )}
      </div>
      <div className="space-y-1">
        <p className="text-3xl font-bold text-gray-900">
          {value}{suffix}
        </p>
        <p className="text-sm text-gray-500">{label}</p>
      </div>
    </Card>
  );
}

interface StatsCardsProps {
  stats: {
    tasksInProgress: number;
    completedTasks: number;
    criticalBugs: number;
    hoursLogged: number;
    hoursTarget: number;
  };
}

export function StatsCards({ stats }: StatsCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <StatCard
        icon={<ListTodo className="w-5 h-5 text-sky-600" />}
        iconBg="bg-sky-50"
        value={stats.tasksInProgress}
        label="Tasks in Progress"
        trend={12}
      />
      <StatCard
        icon={<CheckCircle2 className="w-5 h-5 text-green-600" />}
        iconBg="bg-green-50"
        value={stats.completedTasks}
        label="Completed Tasks"
        trend={5}
      />
      <StatCard
        icon={<Bug className="w-5 h-5 text-orange-600" />}
        iconBg="bg-orange-50"
        value={stats.criticalBugs}
        label="Critical Bugs"
        trend={-2}
      />
      <StatCard
        icon={<Clock className="w-5 h-5 text-red-500" />}
        iconBg="bg-red-50"
        value={stats.hoursLogged}
        label="Hours Logged"
        suffix="h"
        trendLabel={`Target: ${stats.hoursTarget}h`}
      />
    </div>
  );
}
