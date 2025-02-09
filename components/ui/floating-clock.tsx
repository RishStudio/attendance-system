'use client';

import { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

export function FloatingClock() {
  const [time, setTime] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
      }));
    };

    // Initial update
    updateTime();

    // Update every second
    const interval = setInterval(updateTime, 1000);

    return () => clearInterval(interval);
  }, []);

  if (!time) return null; // Don't render until client-side time is available

  return (
    <div className="fixed bottom-4 right-4 bg-background/80 backdrop-blur-sm border rounded-full px-4 py-2 shadow-lg flex items-center gap-2">
      <Clock className="h-4 w-4 text-muted-foreground" />
      <time className="text-sm font-medium">{time}</time>
    </div>
  );
}