'use client';

import { useEffect, useState } from 'react';
import { Clock, Calendar, MapPin, Cloud, Thermometer, AlertCircle, Bell } from 'lucide-react';
import { Card } from './card';

interface WeatherData {
  temp: number;
  condition: string;
}

export function FloatingClock() {
  const [time, setTime] = useState('');
  const [date, setDate] = useState('');
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [alarmTime, setAlarmTime] = useState<string | null>('07:00:00 AM');
  const [showAlarmPopup, setShowAlarmPopup] = useState(false);

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
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

      // Check if it's alarm time
      if (alarmTime && now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true }) === alarmTime) {
        setShowAlarmPopup(true);
        const audio = new Audio('/public/music/music.wav');
        audio.play();
        setAlarmTime(null); // Reset alarm after triggering
      }
    };

    // Simulate weather data (replace with actual API in production)
    const mockWeather = {
      temp: 24,
      condition: 'Partly Cloudy'
    };
    setWeather(mockWeather);

    updateDateTime();
    const interval = setInterval(updateDateTime, 1000);
    return () => clearInterval(interval);
  }, [alarmTime]);

  const handleAlarmSet = () => {
    const newAlarmTime = prompt('Set Alarm Time (HH:MM:SS AM/PM)', '07:00:00 AM');
    if (newAlarmTime) {
      setAlarmTime(newAlarmTime);
      setShowPopup(true);
      setTimeout(() => setShowPopup(false), 3000);
    }
  };

  return (
    <div>
      <Card className={`fixed bottom-4 right-4 transition-all duration-300 ${
        isExpanded 
          ? 'w-80 bg-gray-800/95' 
          : 'w-auto bg-gray-800/80'
      } backdrop-blur-sm border rounded-xl shadow-lg hover:shadow-xl`}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
      >
        <div className="p-4">
          <div className="flex items-center gap-3 cursor-pointer" onClick={handleAlarmSet}>
            <Clock className="h-5 w-5 text-white" />
            <div className="text-lg font-mono font-semibold text-white" suppressHydrationWarning>
              {time}
            </div>
            <Bell className="h-5 w-5 text-white ml-auto" />
          </div>
          
          {isExpanded && (
            <div className="mt-4 space-y-3 animate-in fade-in slide-in-from-right-5 duration-300">
              <div className="flex items-center gap-3 text-sm text-gray-400">
                <Calendar className="h-4 w-4" />
                <span>{date}</span>
              </div>
              
              <div className="flex items-center gap-3 text-sm text-gray-400">
                <MapPin className="h-4 w-4" />
                <span>Mahinda Rajapaksha College Matara</span>
              </div>
              
              {weather && (
                <div className="flex items-center gap-3 text-sm text-gray-400">
                  <div className="flex items-center gap-2">
                    <Thermometer className="h-4 w-4" />
                    <span>{weather.temp}°C</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Cloud className="h-4 w-4" />
                    <span>{weather.condition}</span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </Card>

      {showPopup && (
        <div className="fixed top-4 right-4 bg-green-500 text-white p-4 rounded-lg shadow-lg flex items-center gap-2">
          <AlertCircle className="h-6 w-6" />
          <span>Alarm set for {alarmTime}</span>
          <button onClick={() => setShowPopup(false)} className="ml-auto bg-transparent border-none text-white">
            ✕
          </button>
        </div>
      )}

      {showAlarmPopup && (
        <div className="fixed top-4 right-4 bg-red-500 text-white p-4 rounded-lg shadow-lg flex items-center gap-2">
          <AlertCircle className="h-6 w-6" />
          <span>It's time!</span>
          <button onClick={() => setShowAlarmPopup(false)} className="ml-auto bg-transparent border-none text-white">
            ✕
          </button>
        </div>
      )}
    </div>
  );
}