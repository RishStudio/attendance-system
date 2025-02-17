'use client';

import { AttendanceRecord, DailyStats, PrefectRole } from './types';

const STORAGE_KEY = 'prefect_attendance_records';
const MAX_DAYS = 60;
const ADMIN_PIN = '11111'; // In a production environment, this should be properly secured

export function checkAdminAccess(pin: string): boolean {
  if (pin !== ADMIN_PIN) {
    throw new Error('Invalid PIN');
  }
  return true;
}

export function saveAttendance(prefectNumber: string, role: PrefectRole): AttendanceRecord {
  const now = new Date();
  return saveManualAttendance(prefectNumber, role, now);
}

export function saveManualAttendance(
  prefectNumber: string,
  role: PrefectRole,
  timestamp: Date
): AttendanceRecord {
  const records = getAttendanceRecords();
  
  const record: AttendanceRecord = {
    id: crypto.randomUUID(),
    prefectNumber,
    role,
    timestamp: timestamp.toISOString(),
    date: timestamp.toLocaleDateString(),
  };

  records.push(record);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
  
  cleanOldRecords();
  return record;
}

export function updateAttendance(
  id: string,
  updates: Partial<AttendanceRecord>
): AttendanceRecord {
  const records = getAttendanceRecords();
  const index = records.findIndex(r => r.id === id);
  
  if (index === -1) {
    throw new Error('Record not found');
  }

  const updatedRecord = {
    ...records[index],
    ...updates,
  };

  records[index] = updatedRecord;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
  
  return updatedRecord;
}

export function deleteAttendance(id: string): void {
  const records = getAttendanceRecords();
  const filteredRecords = records.filter(r => r.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredRecords));
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

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const stats = getDailyStats(date);
  
  const header = [
    '# Prefect Board Attendance Report',
    `Date: ${formatDate(date)}`,
    `Total Prefects: ${stats.total}`,
    `On Time: ${stats.onTime}`,
    `Late: ${stats.late}`,
    '',
    '## Role Distribution',
    ...Object.entries(stats.byRole)
      .filter(([_, count]) => count > 0)
      .map(([role, count]) => `${role}: ${count}`),
    '',
    '## Attendance Records',
    ['Prefect Number', 'Role', 'Time', 'Status', 'Notes'].join(',')
  ].join('\n');

  const recordsCSV = records.map(record => {
    const time = new Date(record.timestamp);
    const status = time.getHours() < 7 || (time.getHours() === 7 && time.getMinutes() === 0) 
      ? 'On Time' 
      : 'Late';
    const timeFormatted = time.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
    const notes = status === 'Late' 
      ? `Arrived ${time.getHours() - 7}h ${time.getMinutes()}m late`
      : 'Regular attendance';
    return [
      record.prefectNumber,
      record.role,
      timeFormatted,
      status,
      notes
    ].join(',');
  }).join('\n');

  return `${header}\n${recordsCSV}`;
}