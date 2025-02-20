'use client';

import { useEffect, useState } from 'react';
import { Clock, Calendar, MapPin, Bell } from 'lucide-react';
import { Card } from './card';
import { toast } from 'sonner';

interface Alarm {
  time: string;
  message: string;
}

export function FloatingClock() {
  const [time, setTime] = useState('');
  const [date, setDate] = useState('');
  const [alarms, setAlarms] = useState<Alarm[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isAlarmFormVisible, setIsAlarmFormVisible] = useState(false);
  const [alarmTime, setAlarmTime] = useState('');
  const [alarmMessage, setAlarmMessage] = useState('');

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      const hours = now.getHours();
      const minutes = now.getMinutes();
      const seconds = now.getSeconds();

      setTime(now.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
      }));
      setDate(now.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }));

      // Check for alarms
      alarms.forEach(alarm => {
        const [alarmHours, alarmMinutes] = alarm.time.split(':').map(Number);
        if (hours === alarmHours && minutes === alarmMinutes && seconds === 0) {
          toast.info('Alarm', {
            description: alarm.message,
            duration: 5000,
          });
        }
      });
    };

    updateDateTime();
    const interval = setInterval(updateDateTime, 1000);
    return () => clearInterval(interval);
  }, [alarms]);

  const handleSetAlarm = () => {
    if (alarmTime && alarmMessage) {
      setAlarms([...alarms, { time: alarmTime, message: alarmMessage }]);
      setAlarmTime('');
      setAlarmMessage('');
      setIsAlarmFormVisible(false);
      toast.success('Alarm Set', {
        description: `Alarm set for ${alarmTime}`,
        duration: 3000,
      });
    } else {
      toast.error('Error', {
        description: 'Please provide both time and message for the alarm.',
        duration: 3000,
      });
    }
  };

  return (
    <Card className={`fixed bottom-4 right-4 transition-all duration-300 ${
      isExpanded 
        ? 'w-80 bg-background/95' 
        : 'w-auto bg-background/80'
    } backdrop-blur-sm border rounded-xl shadow-lg hover:shadow-xl`}
    onMouseEnter={() => setIsExpanded(true)}
    onMouseLeave={() => setIsExpanded(false)}
    >
      <div className="p-4">
        <div className="flex items-center gap-3">
          <Clock className="h-5 w-5 text-primary cursor-pointer" onClick={() => setIsAlarmFormVisible(!isAlarmFormVisible)} />
          <div className="text-lg font-mono font-semibold" suppressHydrationWarning>
            {time}
          </div>
        </div>
        
        {isExpanded && (
          <div className="mt-4 space-y-3 animate-in fade-in slide-in-from-right-5 duration-300">
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>{date}</span>
            </div>
            
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <span>Mahinda Rajapaksha College Matara</span>
            </div>

            {isAlarmFormVisible && (
              <div className="mt-4 space-y-3">
                <div className="flex items-center gap-3">
                  <input 
                    type="time" 
                    value={alarmTime} 
                    onChange={(e) => setAlarmTime(e.target.value)} 
                    className="border rounded p-2 w-full"
                  />
                </div>
                <div className="flex items-center gap-3">
                  <input 
                    type="text" 
                    placeholder="Alarm Message" 
                    value={alarmMessage}
                    onChange={(e) => setAlarmMessage(e.target.value)} 
                    className="border rounded p-2 w-full"
                  />
                </div>
                <button 
                  onClick={handleSetAlarm} 
                  className="w-full bg-primary text-white rounded p-2"
                >
                  Set Alarm
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </Card>
  );
}