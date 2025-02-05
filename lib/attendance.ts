'use client';

import { AttendanceRecord, DailyStats, PrefectRole } from './types';

const STORAGE_KEY = 'prefect_attendance_records';
const MAX_DAYS = 14;

export function saveAttendance(prefectNumber: string, role: PrefectRole): AttendanceRecord {
  const records = getAttendanceRecords();
  const now = new Date();
  
  const record: AttendanceRecord = {
    id: crypto.randomUUID(),
    prefectNumber,
    role,
    timestamp: now.toISOString(),
    date: now.toLocaleDateString(),
  };

  records.push(record);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
  
  cleanOldRecords();
  return record;
}

export function getAttendanceRecords(): AttendanceRecord[] {
  const records = localStorage.getItem(STORAGE_KEY);
  return records ? JSON.parse(records) : [];
}

export function getDailyStats(date: string): DailyStats {
  const records = getAttendanceRecords().filter(r => r.date === date);
  const stats: DailyStats = {
    total: records.length,
    onTime: 0,
    late: 0,
    byRole: {
      Head: 0,
      Deputy: 0,
      'Senior Executive': 0,
      Executive: 0,
      'Super Senior': 0,
      Senior: 0,
      Junior: 0,
      Sub: 0,
      Apprentice: 0,
    },
  };

  records.forEach(record => {
    const time = new Date(record.timestamp);
    if (time.getHours() < 7 || (time.getHours() === 7 && time.getMinutes() === 0)) {
      stats.onTime++;
    } else {
      stats.late++;
    }
    stats.byRole[record.role]++;
  });

  return stats;
}

export function cleanOldRecords() {
  const records = getAttendanceRecords();
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - MAX_DAYS);
  
  const filteredRecords = records.filter(record => 
    new Date(record.timestamp) > cutoff
  );
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredRecords));
}

export function exportAttendance(date: string): string {
  const records = getAttendanceRecords()
    .filter(r => r.date === date)
    .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

  const csv = [
    ['Prefect Number', 'Role', 'Time', 'Status'].join(','),
    ...records.map(record => {
      const time = new Date(record.timestamp);
      const status = time.getHours() < 7 || (time.getHours() === 7 && time.getMinutes() === 0) 
        ? 'On Time' 
        : 'Late';
      return [
        record.prefectNumber,
        record.role,
        time.toLocaleTimeString(),
        status
      ].join(',');
    })
  ].join('\n');

  return csv;
}