'use client';

import { AttendanceRecord, DailyStats, PrefectRole } from './types';

const STORAGE_KEY = 'prefect_attendance_records';
const MAX_DAYS = 60;
const FAILED_ATTEMPTS_KEY = 'admin_failed_attempts';
const LOCKOUT_TIME_KEY = 'admin_lockout_time';
const MAX_FAILED_ATTEMPTS = 3;
const LOCKOUT_DURATION = 15 * 60 * 1000; // 15 minutes

export function checkDuplicateAttendance(prefectNumber: string, role: PrefectRole, date: string): boolean {
  const records = getAttendanceRecords();
  return records.some(record => 
    record.prefectNumber === prefectNumber && 
    record.role === role && 
    record.date === date
  );
}

export function checkAdminAccess(pin: string): boolean {
  const now = Date.now();
  const lockoutTime = Number(localStorage.getItem(LOCKOUT_TIME_KEY) || '0');
  
  if (now < lockoutTime) {
    const remainingMinutes = Math.ceil((lockoutTime - now) / 60000);
    throw new Error(`Account is locked. Please try again in ${remainingMinutes} minutes.`);
  }

  if (pin === 'world') {
    localStorage.removeItem(FAILED_ATTEMPTS_KEY);
    localStorage.removeItem(LOCKOUT_TIME_KEY);
    return true;
  }

  const failedAttempts = Number(localStorage.getItem(FAILED_ATTEMPTS_KEY) || '0') + 1;
  localStorage.setItem(FAILED_ATTEMPTS_KEY, failedAttempts.toString());

  if (failedAttempts >= MAX_FAILED_ATTEMPTS) {
    const lockoutTime = now + LOCKOUT_DURATION;
    localStorage.setItem(LOCKOUT_TIME_KEY, lockoutTime.toString());
    throw new Error(`Too many failed attempts. Account locked for ${LOCKOUT_DURATION / 60000} minutes.`);
  }

  const remainingAttempts = MAX_FAILED_ATTEMPTS - failedAttempts;
  throw new Error(`Invalid PIN. ${remainingAttempts} ${remainingAttempts === 1 ? 'attempt' : 'attempts'} remaining.`);
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
  const date = timestamp.toLocaleDateString();
  
  if (checkDuplicateAttendance(prefectNumber, role, date)) {
    throw new Error(`A prefect with number ${prefectNumber} has already registered for role ${role} today.`);
  }

  const records = getAttendanceRecords();
  
  const record: AttendanceRecord = {
    id: crypto.randomUUID(),
    prefectNumber,
    role,
    timestamp: timestamp.toISOString(),
    date,
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

  // Check for duplicates when updating prefect number or role
  if (updates.prefectNumber || updates.role) {
    const date = updates.date || records[index].date;
    const prefectNumber = updates.prefectNumber || records[index].prefectNumber;
    const role = updates.role || records[index].role;
    
    const hasDuplicate = records.some((record, i) => 
      i !== index && 
      record.prefectNumber === prefectNumber && 
      record.role === role && 
      record.date === date
    );
    
    if (hasDuplicate) {
      throw new Error(`A prefect with number ${prefectNumber} has already registered for role ${role} on ${date}.`);
    }
  }

  const updatedRecord = {
    ...records[index],
    ...updates,
  };

  records[index] = updatedRecord;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
  
  return updatedRecord;
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