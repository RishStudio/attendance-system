'use client';

import { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

export function FloatingClock() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="bg-background/80 backdrop-blur-lg border rounded-full px-4 py-2 shadow-lg flex items-center gap-2">
        <Clock className="h-4 w-4 text-primary" />
        <time className="text-sm font-medium">
          {time.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: true,
          })}
        </time>
      </div>
    </div>
  );
}