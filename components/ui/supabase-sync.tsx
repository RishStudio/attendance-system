'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Cloud, 
  CloudOff, 
  Upload, 
  Download, 
  RefreshCw, 
  CheckCircle, 
  AlertCircle,
  Database,
  Wifi,
  WifiOff,
  History,
  Trash2,
  Settings,
  Info
} from 'lucide-react';
import { Button } from './button';
import { Card, CardContent, CardHeader, CardTitle } from './card';
import { Badge } from './badge';
import { Progress } from './progress';
import { toast } from 'sonner';
import { 
  uploadToSupabase, 
  downloadFromSupabase, 
  getSyncStatus, 
  getBackupHistory,
  cleanupOldBackups,
  checkSupabaseConnection,
  type SyncStatus,
  type BackupMetadata
} from '@/lib/supabase';
import { getAttendanceRecords } from '@/lib/attendance';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./tooltip";

export function SupabaseSync() {
  const [syncStatus, setSyncStatus] = useState<SyncStatus>({
    isConnected: false,
    lastSync: null,
    recordsCount: 0
  });
  const [isUploading, setIsUploading] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [backupHistory, setBackupHistory] = useState<BackupMetadata[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [autoSyncEnabled, setAutoSyncEnabled] = useState(false);

  // Load initial status
  useEffect(() => {
    loadSyncStatus();
    loadBackupHistory();
    
    const autoSync = localStorage.getItem('auto_sync_enabled');
    setAutoSyncEnabled(autoSync === 'true');
  }, []);

  // Auto-sync timer (if enabled)
  useEffect(() => {
    if (!autoSyncEnabled) return;

    const interval = setInterval(async () => {
      const status = await getSyncStatus();
      if (status.isConnected) {
        handleUpload(true); // Silent upload
      }
    }, 5 * 60 * 1000); // Every 5 minutes

    return () => clearInterval(interval);
  }, [autoSyncEnabled]);

  const loadSyncStatus = async () => {
    const status = await getSyncStatus();
    setSyncStatus(status);
  };

  const loadBackupHistory = async () => {
    const history = await getBackupHistory();
    setBackupHistory(history);
  };

  const checkConnection = async () => {
    setIsChecking(true);
    try {
      const isConnected = await checkSupabaseConnection();
      setSyncStatus(prev => ({ ...prev, isConnected }));
      
      if (isConnected) {
        toast.success('Connection Successful', {
          description: 'Successfully connected to Supabase',
        });
      } else {
        toast.error('Connection Failed', {
          description: 'Unable to connect to Supabase. Please check your configuration.',
        });
      }
    } catch (error) {
      toast.error('Connection Error', {
        description: 'An error occurred while checking the connection.',
      });
    } finally {
      setIsChecking(false);
    }
  };

  const handleUpload = async (silent = false) => {
    setIsUploading(true);
    setUploadProgress(0);

    try {
      const records = getAttendanceRecords();
      
      if (records.length === 0) {
        if (!silent) {
          toast.info('No Records to Upload', {
            description: 'There are no attendance records to sync.',
          });
        }
        return;
      }

      // Simulate progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => Math.min(prev + 10, 90));
      }, 200);

      const result = await uploadToSupabase(records);
      
      clearInterval(progressInterval);
      setUploadProgress(100);

      if (result.success) {
        await loadSyncStatus();
        await loadBackupHistory();
        await cleanupOldBackups();
        
        if (!silent) {
          toast.success('Upload Successful', {
            description: `${records.length} records synced to Supabase`,
          });
        }
      } else {
        throw new Error(result.error || 'Upload failed');
      }
    } catch (error) {
      if (!silent) {
        toast.error('Upload Failed', {
          description: error instanceof Error ? error.message : 'Failed to upload records',
        });
      }
    } finally {
      setIsUploading(false);
      setTimeout(() => setUploadProgress(0), 1000);
    }
  };

  const handleDownload = async () => {
    setIsDownloading(true);
    setDownloadProgress(0);

    try {
      // Simulate progress
      const progressInterval = setInterval(() => {
        setDownloadProgress(prev => Math.min(prev + 15, 90));
      }, 300);

      const result = await downloadFromSupabase();
      
      clearInterval(progressInterval);
      setDownloadProgress(100);

      if (result.success && result.records) {
        const confirmReplace = confirm(
          `This will replace your local data with ${result.records.length} records from Supabase. Continue?`
        );
        
        if (confirmReplace) {
          localStorage.setItem('prefect_attendance_records', JSON.stringify(result.records));
          await loadSyncStatus();
          
          toast.success('Download Successful', {
            description: `${result.records.length} records downloaded from Supabase`,
          });
          
          // Refresh the page to show new data
          window.location.reload();
        }
      } else {
        throw new Error(result.error || 'Download failed');
      }
    } catch (error) {
      toast.error('Download Failed', {
        description: error instanceof Error ? error.message : 'Failed to download records',
      });
    } finally {
      setIsDownloading(false);
      setTimeout(() => setDownloadProgress(0), 1000);
    }
  };

  const toggleAutoSync = () => {
    const newValue = !autoSyncEnabled;
    setAutoSyncEnabled(newValue);
    localStorage.setItem('auto_sync_enabled', newValue.toString());
    
    toast.success(newValue ? 'Auto-sync Enabled' : 'Auto-sync Disabled', {
      description: newValue 
        ? 'Records will be automatically synced every 5 minutes'
        : 'Automatic syncing has been disabled',
    });
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <Card className="backdrop-blur-sm bg-background/80 border border-white/10">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5" />
          Supabase Sync & Backup
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Connection Status */}
        <div className="flex items-center justify-between p-4 rounded-lg bg-background/30 backdrop-blur-sm border border-white/10">
          <div className="flex items-center gap-3">
            {syncStatus.isConnected ? (
              <Wifi className="h-5 w-5 text-green-500" />
            ) : (
              <WifiOff className="h-5 w-5 text-red-500" />
            )}
            <div>
              <p className="font-medium">
                {syncStatus.isConnected ? 'Connected' : 'Disconnected'}
              </p>
              <p className="text-sm text-muted-foreground">
                {syncStatus.lastSync 
                  ? `Last sync: ${syncStatus.lastSync.toLocaleString()}`
                  : 'Never synced'
                }
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={checkConnection}
            disabled={isChecking}
            className="gap-2"
          >
            {isChecking ? (
              <RefreshCw className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
            Test Connection
          </Button>
        </div>

        {/* Sync Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-lg bg-background/30 backdrop-blur-sm border border-white/10">
            <div className="flex items-center gap-2 mb-2">
              <Cloud className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Cloud Records</span>
            </div>
            <p className="text-2xl font-bold">{syncStatus.recordsCount}</p>
          </div>

          <div className="p-4 rounded-lg bg-background/30 backdrop-blur-sm border border-white/10">
            <div className="flex items-center gap-2 mb-2">
              <Database className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Local Records</span>
            </div>
            <p className="text-2xl font-bold">{getAttendanceRecords().length}</p>
          </div>

          <div className="p-4 rounded-lg bg-background/30 backdrop-blur-sm border border-white/10">
            <div className="flex items-center gap-2 mb-2">
              <History className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Backups</span>
            </div>
            <p className="text-2xl font-bold">{backupHistory.length}</p>
          </div>
        </div>

        {/* Sync Actions */}
        <div className="space-y-4">
          <div className="flex flex-wrap gap-3">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    onClick={() => handleUpload()}
                    disabled={isUploading || !syncStatus.isConnected}
                    className="gap-2 flex-1 sm:flex-none"
                  >
                    {isUploading ? (
                      <RefreshCw className="h-4 w-4 animate-spin" />
                    ) : (
                      <Upload className="h-4 w-4" />
                    )}
                    {isUploading ? 'Uploading...' : 'Upload to Cloud'}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Upload local records to Supabase</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    onClick={handleDownload}
                    disabled={isDownloading || !syncStatus.isConnected}
                    className="gap-2 flex-1 sm:flex-none"
                  >
                    {isDownloading ? (
                      <RefreshCw className="h-4 w-4 animate-spin" />
                    ) : (
                      <Download className="h-4 w-4" />
                    )}
                    {isDownloading ? 'Downloading...' : 'Download from Cloud'}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Download records from Supabase</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <Button
              variant="outline"
              onClick={toggleAutoSync}
              className="gap-2 flex-1 sm:flex-none"
            >
              <Settings className="h-4 w-4" />
              Auto-sync: {autoSyncEnabled ? 'ON' : 'OFF'}
            </Button>

            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <History className="h-4 w-4" />
                  History
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Backup History</DialogTitle>
                  <DialogDescription>
                    View your recent backup history and metadata
                  </DialogDescription>
                </DialogHeader>
                <div className="max-h-[400px] overflow-y-auto space-y-3">
                  {backupHistory.map((backup, index) => (
                    <div
                      key={backup.id}
                      className="p-4 rounded-lg bg-background/30 backdrop-blur-sm border border-white/10"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium">
                            Backup #{backupHistory.length - index}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(backup.created_at).toLocaleString()}
                          </p>
                        </div>
                        <Badge variant="outline">
                          v{backup.version}
                        </Badge>
                      </div>
                      <div className="mt-2 grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Records:</span>
                          <span className="ml-2 font-medium">{backup.records_count}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Size:</span>
                          <span className="ml-2 font-medium">{formatBytes(backup.backup_size)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                  {backupHistory.length === 0 && (
                    <p className="text-center text-muted-foreground py-8">
                      No backup history available
                    </p>
                  )}
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Progress Bars */}
          <AnimatePresence>
            {isUploading && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-2"
              >
                <div className="flex justify-between text-sm">
                  <span>Uploading to Supabase...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <Progress value={uploadProgress} className="h-2" />
              </motion.div>
            )}

            {isDownloading && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-2"
              >
                <div className="flex justify-between text-sm">
                  <span>Downloading from Supabase...</span>
                  <span>{downloadProgress}%</span>
                </div>
                <Progress value={downloadProgress} className="h-2" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Info Section */}
        <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
          <div className="flex items-start gap-3">
            <Info className="h-5 w-5 text-blue-500 mt-0.5" />
            <div>
              <h4 className="font-medium text-blue-500 mb-1">Supabase Integration</h4>
              <p className="text-sm text-muted-foreground">
                Your data is securely synced with Supabase cloud database. 
                Enable auto-sync for automatic backups every 5 minutes. 
                Manual sync gives you full control over when data is uploaded or downloaded.
              </p>
            </div>
          </div>
        </div>

        {/* Error Display */}
        {syncStatus.error && (
          <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-red-500 mt-0.5" />
              <div>
                <h4 className="font-medium text-red-500 mb-1">Sync Error</h4>
                <p className="text-sm text-muted-foreground">{syncStatus.error}</p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}