'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, PieChart } from 'lucide-react';
import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
} from 'recharts';
import { AttendanceRecord } from '@/lib/types';
import { useMemo } from 'react';

interface AnalyticsSectionProps {
  records: AttendanceRecord[];
}

export function AnalyticsSection({ records }: AnalyticsSectionProps) {
  const attendanceTrends = useMemo(() => {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      return date.toLocaleDateString();
    }).reverse();

    return last7Days.map(date => {
      const dayRecords = records.filter(r => r.date === date);
      const onTime = dayRecords.filter(r => {
        const time = new Date(r.timestamp);
        return time.getHours() < 7 || (time.getHours() === 7 && time.getMinutes() === 0);
      }).length;
      
      return {
        date: new Date(date).toLocaleDateString('en-US', { weekday: 'short' }),
        onTime,
        late: dayRecords.length - onTime,
      };
    });
  }, [records]);

  const roleDistribution = useMemo(() => {
    const distribution = records.reduce((acc, record) => {
      acc[record.role] = (acc[record.role] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(distribution)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [records]);

  const COLORS = [
    '#10b981', // Green
    '#3b82f6', // Blue
    '#6366f1', // Indigo
    '#8b5cf6', // Violet
    '#ec4899', // Pink
    '#f87171', // Light Red
    '#fbbf24', // Light Yellow
    '#34d399', // Light Green
    '#60a5fa', // Light Blue
    '#a78bfa', // Light Purple
    '#f43f5e', // Dark Red
    '#f59e0b', // Dark Yellow
    '#059669', // Dark Green
    '#2563eb', // Dark Blue
    '#7c3aed'  // Dark Purple
  ];

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card className="backdrop-blur-sm bg-background/80">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Attendance Trends
          </CardTitle>
          <CardDescription>Last 7 days attendance patterns</CardDescription>
        </CardHeader>
        <CardContent className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <RechartsLineChart data={attendanceTrends}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="onTime" stroke="#10b981" name="On Time" />
              <Line type="monotone" dataKey="late" stroke="#ef4444" name="Late" />
            </RechartsLineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="backdrop-blur-sm bg-background/80">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PieChart className="h-5 w-5" />
            Role Distribution
          </CardTitle>
          <CardDescription>Current month breakdown</CardDescription>
        </CardHeader>
        <CardContent className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <RechartsPieChart>
              <Pie
                data={roleDistribution}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                fill="#8884d8"
                paddingAngle={5}
                dataKey="value"
              >
                {roleDistribution.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </RechartsPieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}