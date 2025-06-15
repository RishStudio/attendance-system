'use client';

import { createClient } from '@supabase/supabase-js';
import { AttendanceRecord } from './types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface SyncStatus {
  isConnected: boolean;
  lastSync: Date | null;
  recordsCount: number;
  error?: string;
}

export interface BackupMetadata {
  id: string;
  created_at: string;
  device_id: string;
  records_count: number;
  backup_size: number;
  checksum: string;
  version: string;
}

// Check Supabase connection
export async function checkSupabaseConnection(): Promise<boolean> {
  try {
    const { data, error } = await supabase.from('attendance_records').select('count').limit(1);
    return !error;
  } catch (error) {
    console.error('Supabase connection error:', error);
    return false;
  }
}

// Get device ID for tracking
function getDeviceId(): string {
  let deviceId = localStorage.getItem('device_id');
  if (!deviceId) {
    deviceId = crypto.randomUUID();
    localStorage.setItem('device_id', deviceId);
  }
  return deviceId;
}

// Upload attendance records to Supabase
export async function uploadToSupabase(records: AttendanceRecord[]): Promise<{ success: boolean; error?: string }> {
  try {
    const deviceId = getDeviceId();
    const timestamp = new Date().toISOString();
    
    // Prepare records with metadata
    const recordsWithMetadata = records.map(record => ({
      ...record,
      device_id: deviceId,
      synced_at: timestamp,
      local_id: record.id
    }));

    // Upload records
    const { error: recordsError } = await supabase
      .from('attendance_records')
      .upsert(recordsWithMetadata, { 
        onConflict: 'local_id,device_id',
        ignoreDuplicates: false 
      });

    if (recordsError) {
      throw recordsError;
    }

    // Create backup metadata
    const backupMetadata: Omit<BackupMetadata, 'id' | 'created_at'> = {
      device_id: deviceId,
      records_count: records.length,
      backup_size: new Blob([JSON.stringify(records)]).size,
      checksum: btoa(JSON.stringify(records)).slice(0, 16),
      version: '2.0.0'
    };

    const { error: metadataError } = await supabase
      .from('backup_metadata')
      .insert(backupMetadata);

    if (metadataError) {
      console.warn('Failed to save backup metadata:', metadataError);
    }

    // Update local sync status
    localStorage.setItem('last_supabase_sync', timestamp);
    localStorage.setItem('supabase_sync_count', records.length.toString());

    return { success: true };
  } catch (error) {
    console.error('Upload to Supabase failed:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error occurred' 
    };
  }
}

// Download attendance records from Supabase
export async function downloadFromSupabase(): Promise<{ 
  success: boolean; 
  records?: AttendanceRecord[]; 
  error?: string 
}> {
  try {
    const deviceId = getDeviceId();
    
    const { data, error } = await supabase
      .from('attendance_records')
      .select('*')
      .eq('device_id', deviceId)
      .order('synced_at', { ascending: false });

    if (error) {
      throw error;
    }

    // Convert back to local format
    const localRecords: AttendanceRecord[] = (data || []).map(record => ({
      id: record.local_id,
      prefectNumber: record.prefectNumber,
      role: record.role,
      timestamp: record.timestamp,
      date: record.date
    }));

    return { success: true, records: localRecords };
  } catch (error) {
    console.error('Download from Supabase failed:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error occurred' 
    };
  }
}

// Get sync status
export async function getSyncStatus(): Promise<SyncStatus> {
  try {
    const isConnected = await checkSupabaseConnection();
    const lastSyncStr = localStorage.getItem('last_supabase_sync');
    const recordsCountStr = localStorage.getItem('supabase_sync_count');
    
    return {
      isConnected,
      lastSync: lastSyncStr ? new Date(lastSyncStr) : null,
      recordsCount: recordsCountStr ? parseInt(recordsCountStr, 10) : 0
    };
  } catch (error) {
    return {
      isConnected: false,
      lastSync: null,
      recordsCount: 0,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

// Get backup history from Supabase
export async function getBackupHistory(): Promise<BackupMetadata[]> {
  try {
    const deviceId = getDeviceId();
    
    const { data, error } = await supabase
      .from('backup_metadata')
      .select('*')
      .eq('device_id', deviceId)
      .order('created_at', { ascending: false })
      .limit(10);

    if (error) {
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error('Failed to get backup history:', error);
    return [];
  }
}

// Delete old backups (keep last 5)
export async function cleanupOldBackups(): Promise<void> {
  try {
    const deviceId = getDeviceId();
    
    const { data: backups } = await supabase
      .from('backup_metadata')
      .select('id, created_at')
      .eq('device_id', deviceId)
      .order('created_at', { ascending: false });

    if (backups && backups.length > 5) {
      const oldBackupIds = backups.slice(5).map(b => b.id);
      
      await supabase
        .from('backup_metadata')
        .delete()
        .in('id', oldBackupIds);
    }
  } catch (error) {
    console.error('Failed to cleanup old backups:', error);
  }
}