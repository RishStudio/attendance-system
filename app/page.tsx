'use client';

import { useState, useEffect } from 'react';
import { Shield, Keyboard, Bell, AlertTriangle, CheckCircle, Code, X } from 'lucide-react';
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
      // Only handle keyboard shortcuts if not typing in an input
      if (document.activeElement?.tagName !== 'INPUT') {
        const shortcutRole = roleShortcuts[e.key];
        if (shortcutRole) {
          setRole(shortcutRole);
          toast.success('Role Selected', {
            icon: <CheckCircle className="w-6 h-6 text-green-500" />,
            description: `${shortcutRole} selected (${e.key})`,
            duration: 2000,
          });
        }

        // Toggle shortcut visibility with '?' or Shift + '/'
        if (e.key === '?' || (e.key === '/' && e.shiftKey)) {
          e.preventDefault();
          setShowShortcuts(prev => !prev);
        }
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
      const localDate = new Date().toLocaleDateString();

      if (checkDuplicateAttendance(prefectNumber, role, localDate)) {
        toast.error('Duplicate Entry', {
          icon: <AlertTriangle className="w-6 h-6 text-red-500" />,
          description: `Prefect ${prefectNumber} has already registered for ${role} today.`,
          duration: 5000,
        });
        return;
      }

      const record = saveAttendance(prefectNumber, role);
      const time = new Date(record.timestamp);
      const isLate = time.getHours() > 7 || (time.getHours() === 7 && time.getMinutes() > 0);

      toast.success('Attendance Marked Successfully', {
        icon: <CheckCircle className="w-6 h-6 text-green-500" />,
        description: `${role} ${prefectNumber} marked at ${time.toLocaleTimeString()}`,
        duration: 4000,
      });

      if (prefectNumber === '64' && role === 'Sub') {
        toast.info('Developer Notice', {
          icon: <Code className="w-6 h-6 text-purple-500" />,
          description: 'Sub 64 is the mastermind behind this system. Report any issues directly.',
          duration: 5000,
        });
      }

      if (isLate) {
        toast.warning('Late Arrival Detected', {
          icon: <Bell className="w-6 h-6 text-yellow-500" />,
          description: 'Your attendance is marked as late (after 7:00AM).',
          duration: 5000,
        });
      }

      // Reset form
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
    <div className="min-h-screen flex flex-col items-center justify-center py-8 bg-gradient-to-br from-blue-500 to-indigo-500">
      <Card className="w-full max-w-md mx-auto bg-white/20 backdrop-blur-lg border border-white/30 shadow-2xl rounded-xl">
        <CardHeader className="text-center space-y-3">
          <div className="mx-auto p-3 rounded-full bg-white/30 w-16 h-16 flex items-center justify-center backdrop-blur-sm">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-3xl font-bold text-white">Prefect Attendance</CardTitle>
          <CardDescription className="text-base text-white/80">
            Mark your daily attendance
          </CardDescription>
          <Button 
            variant="ghost" 
            size="sm" 
            className="mt-2 text-white"
            onClick={() => setShowShortcuts(prev => !prev)}
          >
            <Keyboard className="w-4 h-4 mr-2" />
            {showShortcuts ? 'Hide Shortcuts' : 'Show Shortcuts'}
          </Button>
        </CardHeader>
        <CardContent>
          {showShortcuts && (
            <div className="mb-6 p-4 rounded-lg bg-white/25 backdrop-blur-sm border border-white/20">
              <h3 className="font-medium mb-2 text-white flex items-center gap-2">
                <Keyboard className="w-4 h-4" />
                Keyboard Shortcuts
              </h3>
              <div className="grid grid-cols-2 gap-2 text-sm text-white">
                {Object.entries(roleShortcuts).map(([key, roleName]) => (
                  <div key={key} className="flex items-center gap-2">
                    <kbd className="px-2 py-1 bg-white/30 rounded text-xs border border-white/20">
                      {key}
                    </kbd>
                    <span>{roleName}</span>
                  </div>
                ))}
                <div className="col-span-2 mt-2 flex items-center gap-2">
                  <kbd className="px-2 py-1 bg-white/30 rounded text-xs border border-white/20">?</kbd>
                  <span>Toggle shortcuts</span>
                </div>
              </div>
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Select 
                value={role} 
                onValueChange={(value) => setRole(value as PrefectRole)}
              >
                <SelectTrigger className="w-full bg-white/30 border-white/30 backdrop-blur-sm">
                  <SelectValue placeholder="Select your role" />
                </SelectTrigger>
                <SelectContent className="bg-white/30 backdrop-blur-sm">
                  {roles.map((roleName, index) => (
                    <SelectItem key={roleName} value={roleName}>
                      <div className="flex items-center justify-between w-full">
                        <span>{roleName}</span>
                        <kbd className="ml-2 px-2 py-0.5 bg-white/40 rounded text-xs">
                          {index + 1}
                        </kbd>
                      </div>
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
                className="w-full bg-white/30 border-white/30 backdrop-blur-sm text-white placeholder-white/80"
              />
            </div>

            <Button type="submit" className="w-full bg-white/40 text-base font-medium hover:bg-white/50 backdrop-blur-sm">
              Mark Attendance
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
