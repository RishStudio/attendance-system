'use client';

import { useState, useEffect } from 'react';
import { Shield, Keyboard, Bell, AlertTriangle, CheckCircle, Code } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { PrefectRole } from '@/lib/types';
import { saveAttendance, checkDuplicateAttendance } from '@/lib/attendance';
import { roles } from '@/lib/constants';

const roleShortcuts: Record<string, PrefectRole> = {
  '1': 'Head',
  '2': 'Deputy',
  '3': 'Senior Executive',
  '4': 'Executive',
  '5': 'Super Senior',
  '6': 'Senior',
  '7': 'Junior',
  '8': 'Sub',
  '9': 'Apprentice',
  '0': 'Games Captain',
};

export default function Home() {
  const [role, setRole] = useState<PrefectRole | ''>('');
  const [prefectNumber, setPrefectNumber] = useState('');
  const [showShortcuts, setShowShortcuts] = useState(false);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (document.activeElement?.tagName !== 'INPUT') {
        const selectedRole = roleShortcuts[e.key];
        if (selectedRole) {
          setRole(selectedRole);
          toast.success('Role Selected', {
            icon: <CheckCircle className="w-6 h-6 text-green-500" />,
            description: `${selectedRole} role selected using shortcut (${e.key})`,
            duration: 2000,
          });
        }
      }

      if (e.key === '?' || (e.key === '/' && e.shiftKey)) {
        e.preventDefault();
        setShowShortcuts((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!role || !prefectNumber) {
      toast.error('Please fill in all fields', {
        icon: <AlertTriangle className="w-6 h-6 text-red-500" />,
        description: 'Both role and prefect number are required.',
        duration: 3000,
      });
      return;
    }

    try {
      if (checkDuplicateAttendance(prefectNumber, role, new Date().toLocaleDateString())) {
        toast.error('Duplicate Entry', {
          icon: <AlertTriangle className="w-6 h-6 text-red-500" />,
          description: `Number ${prefectNumber} already registered for ${role} today.`,
          duration: 5000,
        });
        return;
      }

      const record = saveAttendance(prefectNumber, role);
      const time = new Date(record.timestamp);
      const isLate = time.getHours() >= 7 && time.getMinutes() > 0;

      toast.success('Attendance Marked', {
        icon: <CheckCircle className="w-6 h-6 text-green-500" />,
        description: `${role} ${prefectNumber} marked at ${time.toLocaleTimeString()}`,
        duration: 4000,
      });

      if (prefectNumber === '64' && role === 'Sub') {
        toast.info('Developer Notice', {
          icon: <Code className="w-6 h-6 text-purple-500" />,
          description: 'Sub 64 is the developer. Report any bugs to them.',
          duration: 5000,
        });
      }

      if (isLate) {
        toast.warning('Late Arrival', {
          icon: <Bell className="w-6 h-6 text-yellow-500" />,
          description: 'Marked after 7:00 AM. Please be punctual.',
          duration: 5000,
        });
      }

      setRole('');
      setPrefectNumber('');
    } catch (error) {
      toast.error('Error', {
        icon: <AlertTriangle className="w-6 h-6 text-red-500" />,
        description: error instanceof Error ? error.message : 'Failed to mark attendance',
        duration: 4000,
      });
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-4 py-8">
      <Card className="w-full max-w-md bg-white/5 backdrop-blur-lg border border-white/10 shadow-xl rounded-2xl">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 flex items-center justify-center bg-white/10 rounded-full shadow-inner">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight">Prefect Attendance</CardTitle>
          <CardDescription className="text-sm text-gray-300">
            Mark your daily attendance
          </CardDescription>
          <Button
            variant="ghost"
            size="sm"
            className="mt-2 text-white/80 hover:text-white transition"
            onClick={() => setShowShortcuts((prev) => !prev)}
          >
            <Keyboard className="w-4 h-4 mr-2" />
            {showShortcuts ? 'Hide Shortcuts' : 'Show Shortcuts'}
          </Button>
        </CardHeader>

        <CardContent className="space-y-6">
          {showShortcuts && (
            <div className="p-4 rounded-lg bg-white/10 border border-white/10 text-sm text-white">
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <Keyboard className="w-4 h-4" />
                Keyboard Shortcuts
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(roleShortcuts).map(([key, roleName]) => (
                  <div key={key} className="flex items-center gap-2">
                    <kbd className="px-2 py-1 bg-white/20 rounded text-xs">{key}</kbd>
                    <span>{roleName}</span>
                  </div>
                ))}
                <div className="col-span-2 mt-2 flex items-center gap-2">
                  <kbd className="px-2 py-1 bg-white/20 rounded text-xs">?</kbd>
                  <span>Toggle shortcuts</span>
                </div>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <Select value={role} onValueChange={(value) => setRole(value as PrefectRole)}>
              <SelectTrigger className="w-full bg-white/10 border border-white/20 text-white backdrop-blur-md">
                <SelectValue placeholder="Select your role" />
              </SelectTrigger>
              <SelectContent className="bg-black border border-white/20 text-white">
                {roles.map((roleName, index) => (
                  <SelectItem key={roleName} value={roleName}>
                    <div className="flex items-center justify-between w-full">
                      <span>{roleName}</span>
                      <kbd className="ml-2 px-2 py-0.5 bg-white/10 rounded text-xs">{index + 1}</kbd>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Input
              type="text"
              placeholder="Enter your prefect number"
              value={prefectNumber}
              onChange={(e) => setPrefectNumber(e.target.value)}
              className="w-full bg-white/10 text-white placeholder-white/50 border border-white/20 backdrop-blur-md"
            />

            <Button
              type="submit"
              className="w-full text-base font-medium bg-white text-black hover:bg-white/90 transition backdrop-blur-md"
            >
              Mark Attendance
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
