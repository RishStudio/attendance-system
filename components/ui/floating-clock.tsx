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

    // Update the time immediately when the component mounts
    updateTime();

    // Update the time every second
    const intervalId = setInterval(updateTime, 1000);

    // Clear the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div style={{ position: 'fixed', top: '50px', right: '10px', background: 'white', padding: '10px', borderRadius: '5px', boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)' }}>
      <span>{time}</span>
    </div>
  );
}