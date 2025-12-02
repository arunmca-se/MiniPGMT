import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { MoreHorizontal } from 'lucide-react';

const data = [
  { sprint: 'Sprint 1', completed: 24, planned: 28 },
  { sprint: 'Sprint 2', completed: 32, planned: 30 },
  { sprint: 'Sprint 3', completed: 28, planned: 32 },
  { sprint: 'Sprint 4', completed: 36, planned: 35 },
  { sprint: 'Sprint 5', completed: 30, planned: 32 },
  { sprint: 'Sprint 6', completed: 34, planned: 34 },
];

export function SprintVelocityChart() {
  return (
    <Card className="bg-white border border-gray-100">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-base font-semibold text-gray-900">Sprint Velocity</CardTitle>
        <button className="p-1 hover:bg-gray-100 rounded transition-colors">
          <MoreHorizontal className="w-5 h-5 text-gray-400" />
        </button>
      </CardHeader>
      <CardContent>
        <div className="h-[220px]" style={{ minWidth: 0 }}>
          <ResponsiveContainer width="100%" height="100%" minWidth={0}>
            <BarChart data={data} barGap={4}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis
                dataKey="sprint"
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#64748b', fontSize: 12 }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#64748b', fontSize: 12 }}
                width={30}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                }}
                labelStyle={{ color: '#0f172a', fontWeight: 600 }}
              />
              <Bar
                dataKey="completed"
                name="Completed"
                fill="#0ea5e9"
                radius={[4, 4, 0, 0]}
                maxBarSize={32}
              />
              <Bar
                dataKey="planned"
                name="Planned"
                fill="#e2e8f0"
                radius={[4, 4, 0, 0]}
                maxBarSize={32}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="flex items-center justify-center gap-6 mt-4">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-sky-500" />
            <span className="text-sm text-gray-600">Completed</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-gray-200" />
            <span className="text-sm text-gray-600">Planned</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
