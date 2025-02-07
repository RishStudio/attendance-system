'use client';

import { useState } from 'react';
import { Shield, User, ClipboardCheck, Star, Users, Award, Briefcase, BookOpen, GraduationCap, Hammer } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { PrefectRole } from '@/lib/types';
import { saveAttendance } from '@/lib/attendance';

const roles: { role: PrefectRole, icon: React.ReactNode }[] = [
  { role: 'Head', icon: <Shield /> },
  { role: 'Deputy', icon: <Star /> },
  { role: 'Senior Executive', icon: <Users /> },
  { role: 'Executive', icon: <Award /> },
  { role: 'Super Senior', icon: <Briefcase /> },
  { role: 'Senior', icon: <BookOpen /> },
  { role: 'Junior', icon: <GraduationCap /> },
  { role: 'Sub', icon: <User /> },
  { role: 'Apprentice', icon: <Hammer /> },
];

export default function AttendanceForm() {
  const [role, setRole] = useState<PrefectRole | ''>('');
  const [prefectNumber, setPrefectNumber] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!role || !prefectNumber) {
      toast.error('Please fill in all fields', {
        description: 'Both role and prefect number are required.',
        duration: 3000,
      });
      return;
    }

    const record = saveAttendance(prefectNumber, role);
    const time = new Date(record.timestamp);
    const isLate = time.getHours() >= 7 && time.getMinutes() > 0;

    toast.success('Attendance Marked Successfully', {
      description: `${role} ${prefectNumber} marked at ${time.toLocaleTimeString()}`,
      duration: 4000,
    });

    if (isLate) {
      toast.warning('Late Arrival Detected', {
        description: 'Your attendance has been marked as late (after 7:00 AM). Please ensure timely arrival.',
        duration: 5000,
      });
    }

    setRole('');
    setPrefectNumber('');
  };

  return (
    <div className="relative min-h-[calc(100vh-8rem)] flex flex-col items-center justify-center p-4 sm:p-6">
      <div className="absolute inset-0 -z-10" />
      <Card className="w-full max-w-md mx-auto backdrop-blur-sm bg-background/80">
        <CardHeader className="text-center space-y-2">
          <div className="mx-auto mb-4 p-3 rounded-full bg-primary/10 w-16 h-16 flex items-center justify-center">
            <Shield className="w-8 h-8 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold">BOP Attendance System</CardTitle>
          <CardDescription className="text-sm">Mark your daily attendance</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative">
              <Select value={role} onValueChange={(value) => setRole(value as PrefectRole)}>
                <SelectTrigger className="w-full pl-10">
                  {role ? roles.find(r => r.role === role)?.icon : <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />}
                  <SelectValue placeholder="Select your role" />
                </SelectTrigger>
                <SelectContent>
                  {roles.map(({ role, icon }) => (
                    <SelectItem key={role} value={role}>
                      <span className="flex items-center">
                        <span className="mr-2">{icon}</span>
                        {role}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="relative">
              <Input
                type="text"
                placeholder="Enter your prefect number"
                value={prefectNumber}
                onChange={(e) => setPrefectNumber(e.target.value)}
                className="w-full pl-10"
              />
              <ClipboardCheck className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>

            <Button type="submit" className="w-full text-base font-medium">
              Mark Attendance
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}