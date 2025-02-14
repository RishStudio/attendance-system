'use client';

import { useState, useEffect } from 'react';
import { Shield, Keyboard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { PrefectRole } from '@/lib/types';
import { saveAttendance, checkDuplicateAttendance } from '@/lib/attendance';
import { roles } from '@/lib/constants';

// Keyboard shortcuts for roles
const roleShortcuts: Record<string, PrefectRole> = {
  '1': 'Head',
  '2': 'Deputy',
  '3': 'Senior Executive',
  '4': 'Executive',
  '5': 'Super Senior',
  '6': 'Senior',
  '7': 'Junior',
  '8': 'Sub',
  '9': 'Apprentice'
};

export default function Home() {
  const [role, setRole] = useState<PrefectRole | ''>('');
  const [prefectNumber, setPrefectNumber] = useState('');
  const [showShortcuts, setShowShortcuts] = useState(false);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Only handle number keys when not typing in the prefect number input
      if (document.activeElement?.tagName !== 'INPUT') {
        const selectedRole = roleShortcuts[e.key];
        if (selectedRole) {
          setRole(selectedRole);
          toast.success('Role Selected', {
            description: `${selectedRole} role selected using keyboard shortcut (${e.key})`,
            duration: 2000,
          });
        }
      }

      // Toggle shortcuts visibility with '?' key
      if (e.key === '?' || (e.key === '/' && e.shiftKey)) {
        e.preventDefault();
        setShowShortcuts(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!role || !prefectNumber) {
      toast.error('Please fill in all fields', {
        description: 'Both role and prefect number are required.',
        duration: 3000,
      });
      return;
    }

    try {
      if (checkDuplicateAttendance(prefectNumber, role, new Date().toLocaleDateString())) {
        toast.error('Duplicate Entry', {
          description: `A prefect with number ${prefectNumber} has already registered for role ${role} today.`,
          duration: 5000,
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
    } catch (error) {
      toast.error('Error', {
        description: error instanceof Error ? error.message : 'Failed to mark attendance',
        duration: 4000,
      });
    }
  };

  return (
    <div className="relative min-h-[calc(100vh-8rem)] flex flex-col items-center justify-center py-8">
      <Card className="w-full max-w-md mx-auto backdrop-blur-sm bg-background/80">
        <CardHeader className="text-center space-y-2">
          <div className="mx-auto mb-4 p-3 rounded-full bg-primary/10 w-16 h-16 flex items-center justify-center">
            <Shield className="w-8 h-8 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold">Prefect Attendance</CardTitle>
          <CardDescription className="text-sm">Mark your daily attendance</CardDescription>
          <Button 
            variant="ghost" 
            size="sm" 
            className="mt-2"
            onClick={() => setShowShortcuts(prev => !prev)}
          >
            <Keyboard className="w-4 h-4 mr-2" />
            {showShortcuts ? 'Hide Shortcuts' : 'Show Shortcuts'}
          </Button>
        </CardHeader>
        <CardContent>
          {showShortcuts && (
            <div className="mb-6 p-4 rounded-lg bg-secondary/50">
              <h3 className="font-medium mb-2 flex items-center gap-2">
                <Keyboard className="w-4 h-4" />
                Keyboard Shortcuts
              </h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                {Object.entries(roleShortcuts).map(([key, roleName]) => (
                  <div key={key} className="flex items-center gap-2">
                    <kbd className="px-2 py-1 bg-background rounded text-xs">{key}</kbd>
                    <span>{roleName}</span>
                  </div>
                ))}
                <div className="col-span-2 mt-2 flex items-center gap-2">
                  <kbd className="px-2 py-1 bg-background rounded text-xs">?</kbd>
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
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select your role" />
                </SelectTrigger>
                <SelectContent>
                  {roles.map((roleName, index) => (
                    <SelectItem key={roleName} value={roleName}>
                      <div className="flex items-center justify-between w-full">
                        <span>{roleName}</span>
                        <kbd className="ml-2 px-2 py-0.5 bg-secondary rounded text-xs">
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
                className="w-full"
              />
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