'use client';

import { useState } from 'react';
import { Shield, Clock as ClockIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { PrefectRole } from '@/lib/types';
import { saveManualAttendance } from '@/lib/attendance';

const roles: PrefectRole[] = [
  'Head',
  'Deputy',
  'Senior Executive',
  'Executive',
  'Super Senior',
  'Senior',
  'Junior',
  'Sub',
  'Apprentice'
];

export default function ManualAttendance() {
  const [role, setRole] = useState<PrefectRole | ''>('');
  const [prefectNumber, setPrefectNumber] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!role || !prefectNumber || !date || !time) {
      toast.error('Please fill in all fields', {
        description: 'All fields are required for manual attendance.',
        duration: 3000,
      });
      return;
    }

    try {
      const timestamp = new Date(`${date}T${time}`);
      if (isNaN(timestamp.getTime())) {
        throw new Error('Invalid date/time format');
      }

      const record = await saveManualAttendance(prefectNumber, role, timestamp);
      const isLate = timestamp.getHours() >= 7 && timestamp.getMinutes() > 0;

      toast.success('Manual Attendance Marked', {
        description: `${role} ${prefectNumber} marked for ${timestamp.toLocaleString()}`,
        duration: 4000,
      });

      if (isLate) {
        toast.warning('Late Arrival Recorded', {
          description: 'This attendance has been marked as late (after 7:00 AM).',
          duration: 5000,
        });
      }

      setRole('');
      setPrefectNumber('');
      setDate('');
      setTime('');
    } catch (error) {
      toast.error('Invalid Date/Time', {
        description: 'Please enter a valid date and time.',
        duration: 3000,
      });
    }
  };

  return (
    <div className="relative min-h-[calc(100vh-8rem)] flex flex-col items-center justify-center p-4 sm:p-6">
      <Card className="w-full max-w-md mx-auto backdrop-blur-sm bg-background/80">
        <CardHeader className="text-center space-y-2">
          <div className="mx-auto mb-4 p-3 rounded-full bg-primary/10 w-16 h-16 flex items-center justify-center">
            <ClockIcon className="w-8 h-8 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold">Manual Attendance</CardTitle>
          <CardDescription className="text-sm">Enter attendance with custom date/time</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Select value={role} onValueChange={(value) => setRole(value as PrefectRole)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select your role" />
                </SelectTrigger>
                <SelectContent>
                  {roles.map((role) => (
                    <SelectItem key={role} value={role}>
                      {role}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Input
                type="text"
                placeholder="Enter your prefect number"
                value={prefectNumber}
                onChange={(e) => setPrefectNumber(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
              <Input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
              />
            </div>

            <Button type="submit" className="w-full text-base font-medium">
              Mark Manual Attendance
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}