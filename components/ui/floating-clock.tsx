'use client';

import { useEffect, useState } from 'react';

export function FloatingClock() {
  const [time, setTime] = useState('');

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

    // Update immediately
    updateTime();
    
    // Then update every second
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-background/80 backdrop-blur-sm border rounded-full px-4 py-2 shadow-lg">
      <div className="text-lg font-mono font-semibold" suppressHydrationWarning>
        {time}
      </div>
    </div>
  );
}