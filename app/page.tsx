'use client';

import { useState, useEffect } from 'react';
import { Shield, Keyboard, Bell, AlertTriangle, CheckCircle, Code, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { FormField } from '@/components/ui/form-field';
import { ProgressIndicator } from '@/components/ui/progress-indicator';
import { AutoSaveIndicator } from '@/components/ui/auto-save-indicator';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
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
  '9': 'Apprentice',
  '0': 'Games Captain',
};

const formSteps = ['Select Role', 'Enter Details', 'Confirm'];

export default function Home() {
  const [role, setRole] = useState<PrefectRole | ''>('');
  const [prefectNumber, setPrefectNumber] = useState('');
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [autoSaveStatus, setAutoSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [formErrors, setFormErrors] = useState<{role?: string; prefectNumber?: string}>({});
  const [isOnline, setIsOnline] = useState(true);

  // Auto-save functionality
  useEffect(() => {
    const autoSave = () => {
      if (role || prefectNumber) {
        setAutoSaveStatus('saving');
        setTimeout(() => {
          localStorage.setItem('draft_attendance', JSON.stringify({ role, prefectNumber }));
          setAutoSaveStatus('saved');
          setLastSaved(new Date());
        }, 500);
      }
    };

    const timer = setTimeout(autoSave, 2000);
    return () => clearTimeout(timer);
  }, [role, prefectNumber]);

  // Load draft on mount
  useEffect(() => {
    const draft = localStorage.getItem('draft_attendance');
    if (draft) {
      try {
        const { role: draftRole, prefectNumber: draftNumber } = JSON.parse(draft);
        if (draftRole) setRole(draftRole);
        if (draftNumber) setPrefectNumber(draftNumber);
      } catch (error) {
        console.error('Failed to load draft:', error);
      }
    }
  }, []);

  // Online/offline detection
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (document.activeElement?.tagName !== 'INPUT') {
        const selectedRole = roleShortcuts[e.key];
        if (selectedRole) {
          setRole(selectedRole);
          setCurrentStep(1);
          toast.success('Role Selected', {
            icon: <CheckCircle className="w-6 h-6 text-green-500" />,
            description: `${selectedRole} role selected using keyboard shortcut (${e.key})`,
            duration: 2000,
          });
        }
      }

      if (e.key === '?' || (e.key === '/' && e.shiftKey)) {
        e.preventDefault();
        setShowShortcuts(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  // Form validation
  const validateForm = () => {
    const errors: {role?: string; prefectNumber?: string} = {};
    
    if (!role) {
      errors.role = 'Please select a role';
    }
    
    if (!prefectNumber) {
      errors.prefectNumber = 'Please enter your prefect number';
    } else if (prefectNumber.length < 1) {
      errors.prefectNumber = 'Prefect number must be at least 1 character';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNext = () => {
    if (currentStep === 0 && role) {
      setCurrentStep(1);
    } else if (currentStep === 1 && prefectNumber) {
      if (validateForm()) {
        setCurrentStep(2);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      if (checkDuplicateAttendance(prefectNumber, role as PrefectRole, new Date().toLocaleDateString())) {
        toast.error('Duplicate Entry', {
          icon: <AlertTriangle className="w-6 h-6 text-red-500" />,
          description: `A prefect with number ${prefectNumber} has already registered for role ${role} today.`,
          duration: 5000,
        });
        return;
      }

      const record = saveAttendance(prefectNumber, role as PrefectRole);
      const time = new Date(record.timestamp);
      const isLate = time.getHours() >= 7 && time.getMinutes() > 0;

      toast.success('Attendance Marked Successfully', {
        icon: <CheckCircle className="w-6 h-6 text-green-500" />,
        description: `${role} ${prefectNumber} marked at ${time.toLocaleTimeString()}`,
        duration: 4000,
      });

      if (prefectNumber === '64' && role === 'Sub') {
        toast.info('Developer Notice', {
          icon: <Code className="w-6 h-6 text-purple-500" />,
          description: 'Sub 64 is the mastermind behind this attendance system. Please report any issues or bugs directly to them.',
          duration: 5000,
        });
      }

      if (isLate) {
        toast.warning('Late Arrival Detected', {
          icon: <Bell className="w-6 h-6 text-yellow-500" />,
          description: 'Your attendance has been marked as late (after 7:00 AM). Please ensure timely arrival.',
          duration: 5000,
        });
      }

      // Clear form and draft
      setRole('');
      setPrefectNumber('');
      setCurrentStep(0);
      localStorage.removeItem('draft_attendance');
    } catch (error) {
      toast.error('Error', {
        icon: <AlertTriangle className="w-6 h-6 text-red-500" />,
        description: error instanceof Error ? error.message : 'Failed to mark attendance',
        duration: 4000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-[calc(100vh-8rem)] flex flex-col items-center justify-center py-8 bg-gradient-to-br from-background via-background/95 to-background/90 backdrop-blur-3xl">
      {/* Offline Indicator */}
      <AnimatePresence>
        {!isOnline && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 bg-yellow-500/90 text-black px-4 py-2 rounded-lg backdrop-blur-sm"
          >
            You're offline. Changes will be saved locally.
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="w-full max-w-md mx-auto backdrop-blur-xl bg-background/80 border border-white/10 shadow-2xl">
          <CardHeader className="text-center space-y-2">
            <motion.div 
              className="mx-auto mb-4 p-3 rounded-full bg-primary/10 w-16 h-16 flex items-center justify-center backdrop-blur-sm"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Shield className="w-8 h-8 text-primary" />
            </motion.div>
            <CardTitle className="text-2xl font-bold">Prefect Attendance</CardTitle>
            <CardDescription className="text-sm">Mark your daily attendance</CardDescription>
            
            {/* Progress Indicator */}
            <ProgressIndicator steps={formSteps} currentStep={currentStep} className="mt-4" />
            
            <div className="flex items-center justify-between mt-4">
              <Button 
                variant="ghost" 
                size="sm" 
                className="backdrop-blur-sm"
                onClick={() => setShowShortcuts(prev => !prev)}
              >
                <Keyboard className="w-4 h-4 mr-2" />
                {showShortcuts ? 'Hide Shortcuts' : 'Show Shortcuts'}
              </Button>
              
              <AutoSaveIndicator status={autoSaveStatus} lastSaved={lastSaved} />
            </div>
          </CardHeader>
          
          <CardContent>
            <AnimatePresence>
              {showShortcuts && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mb-6 p-4 rounded-lg bg-secondary/30 backdrop-blur-sm border border-white/10"
                >
                  <h3 className="font-medium mb-2 flex items-center gap-2">
                    <Keyboard className="w-4 h-4" />
                    Keyboard Shortcuts
                  </h3>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    {Object.entries(roleShortcuts).map(([key, roleName]) => (
                      <div key={key} className="flex items-center gap-2">
                        <kbd className="px-2 py-1 bg-background/50 rounded text-xs border border-white/20">{key}</kbd>
                        <span>{roleName}</span>
                      </div>
                    ))}
                    <div className="col-span-2 mt-2 flex items-center gap-2">
                      <kbd className="px-2 py-1 bg-background/50 rounded text-xs border border-white/20">?</kbd>
                      <span>Toggle shortcuts</span>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleSubmit} className="space-y-6">
              <AnimatePresence mode="wait">
                {currentStep === 0 && (
                  <motion.div
                    key="step-0"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <FormField 
                      label="Select your role" 
                      error={formErrors.role}
                      required
                    >
                      <Select 
                        value={role} 
                        onValueChange={(value) => {
                          setRole(value as PrefectRole);
                          setFormErrors(prev => ({ ...prev, role: undefined }));
                        }}
                      >
                        <SelectTrigger className="w-full bg-background/50 border-white/20 backdrop-blur-sm">
                          <SelectValue placeholder="Select your role" />
                        </SelectTrigger>
                        <SelectContent>
                          {roles.map((roleName, index) => (
                            <SelectItem key={roleName} value={roleName}>
                              <div className="flex items-center justify-between w-full">
                                <span>{roleName}</span>
                                <kbd className="ml-2 px-2 py-0.5 bg-secondary rounded text-xs">
                                  {index === 9 ? '0' : (index + 1).toString()}
                                </kbd>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormField>
                  </motion.div>
                )}

                {currentStep === 1 && (
                  <motion.div
                    key="step-1"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <FormField 
                      label="Enter your prefect number" 
                      error={formErrors.prefectNumber}
                      required
                    >
                      <Input
                        type="text"
                        placeholder="Enter your prefect number"
                        value={prefectNumber}
                        onChange={(e) => {
                          setPrefectNumber(e.target.value);
                          setFormErrors(prev => ({ ...prev, prefectNumber: undefined }));
                        }}
                        className="w-full bg-background/50 border-white/20 backdrop-blur-sm"
                      />
                    </FormField>
                  </motion.div>
                )}

                {currentStep === 2 && (
                  <motion.div
                    key="step-2"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-4"
                  >
                    <div className="p-4 rounded-lg bg-secondary/30 backdrop-blur-sm border border-white/10">
                      <h3 className="font-medium mb-2">Confirm Details</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Role:</span>
                          <span className="font-medium">{role}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Prefect Number:</span>
                          <span className="font-medium">{prefectNumber}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Time:</span>
                          <span className="font-medium">{new Date().toLocaleTimeString()}</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="flex gap-3">
                {currentStep > 0 && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setCurrentStep(prev => prev - 1)}
                    className="flex-1 backdrop-blur-sm"
                  >
                    Back
                  </Button>
                )}
                
                {currentStep < 2 ? (
                  <Button
                    type="button"
                    onClick={handleNext}
                    disabled={
                      (currentStep === 0 && !role) || 
                      (currentStep === 1 && !prefectNumber)
                    }
                    className="flex-1 bg-primary/90 hover:bg-primary backdrop-blur-sm"
                  >
                    Next
                  </Button>
                ) : (
                  <Button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="flex-1 bg-primary/90 hover:bg-primary backdrop-blur-sm"
                  >
                    {isSubmitting ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                      />
                    ) : (
                      'Mark Attendance'
                    )}
                  </Button>
                )}
              </div>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}