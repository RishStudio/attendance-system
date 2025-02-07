'use client';

import { useEffect, useState } from 'react';
import {
  Download,
  ArrowLeft,
  AlertTriangle,
  Search,
  Calendar,
  Trash2,
  Maximize,
  Minimize,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { AttendanceRecord, DailyStats } from '@/lib/types';
import {
  getAttendanceRecords,
  getDailyStats,
  exportAttendance,
} from '@/lib/attendance';
import Link from 'next/link';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

export default function AdminPanel() {
  const [date, setDate] = useState(new Date().toLocaleDateString());
  const [stats, setStats] = useState<DailyStats | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredRecords, setFilteredRecords] = useState<AttendanceRecord[]>(
    []
  );
  const [allRecords, setAllRecords] = useState<AttendanceRecord[]>([]);
  const [showClearDialog, setShowClearDialog] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [uniqueDates, setUniqueDates] = useState<string[]>([]);

  useEffect(() => {
    const records = getAttendanceRecords();
    setAllRecords(records);
    const todayRecords = records.filter((r) => r.date === date);
    setFilteredRecords(todayRecords);
    setStats(getDailyStats(date));

    // Get unique dates from records
    const dates = Array.from(new Set(records.map((r) => r.date))).sort(
      (a, b) => new Date(b).getTime() - new Date(a).getTime()
    );
    setUniqueDates(dates);

    const lastExport = localStorage.getItem('last_export_date');
    if (lastExport !== date) {
      toast('Daily Export Reminder', {
        description:
          "Please remember to export today's attendance records before end of day.",
        icon: <AlertTriangle className="h-5 w-5 text-yellow-500" />,
        duration: 2000,
      });
    }
  }, [date]);

  useEffect(() => {
    const filtered = allRecords.filter(
      (record) =>
        record.prefectNumber
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) && record.date === date
    );
    setFilteredRecords(filtered);
  }, [searchQuery, date, allRecords]);

  useEffect(() => {
    const handleFullScreenChange = () => {
      setIsFullScreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullScreenChange);
    return () =>
      document.removeEventListener('fullscreenchange', handleFullScreenChange);
  }, []);

  const handleExport = () => {
    if (filteredRecords.length === 0) {
      toast.error('No Records to Export', {
        description: 'There are no attendance records for the selected date.',
        duration: 4000,
      });
      return;
    }

    const csv = exportAttendance(date);
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `attendance_${date.replace(/\//g, '-')}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);

    localStorage.setItem('last_export_date', date);
    toast.success('Export Successful', {
      description: 'Attendance records have been exported to CSV format.',
      duration: 4000,
    });
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const selectedDate = new Date(e.target.value);
      if (isNaN(selectedDate.getTime())) {
        throw new Error('Invalid date');
      }
      setDate(selectedDate.toLocaleDateString());
    } catch (error) {
      toast.error('Invalid Date', {
        description: 'Please select a valid date.',
        duration: 3000,
      });
    }
  };

  const handleClearData = () => {
    localStorage.removeItem('prefect_attendance_records');
    localStorage.removeItem('last_export_date');
    setAllRecords([]);
    setFilteredRecords([]);
    setStats(null);
    setUniqueDates([]);
    setShowClearDialog(false);
    toast.success('Data Cleared', {
      description: 'All attendance records have been cleared successfully.',
    });
  };

  const toggleFullScreen = () => {
    try {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen();
      } else {
        document.exitFullscreen();
      }
    } catch (error) {
      toast.error('Fullscreen Error', {
        description: 'Unable to toggle fullscreen mode.',
        duration: 3000,
      });
    }
  };

  return (
    <div className="relative min-h-[calc(100vh-8rem)] p-4 sm:p-8 bg-gray-50 dark:bg-gray-900">
      <div className="absolute inset-0 -z-10" />
      <div className="relative max-w-7xl mx-auto space-y-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" className="gap-2">
                <ArrowLeft className="h-4 w-4" /> Back
              </Button>
            </Link>
            <Button
              variant="outline"
              size="icon"
              onClick={toggleFullScreen}
              className="hidden sm:flex"
            >
              {isFullScreen ? (
                <Minimize className="h-4 w-4" />
              ) : (
                <Maximize className="h-4 w-4" />
              )}
            </Button>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <div className="relative flex-1 sm:flex-initial">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search by prefect number..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="relative flex-1 sm:flex-initial">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="date"
                value={new Date(date).toISOString().split('T')[0]}
                onChange={handleDateChange}
                className="pl-10"
              />
            </div>
            <Button onClick={handleExport} className="gap-2 w-full sm:w-auto">
              <Download className="h-4 w-4" /> Export Records
            </Button>
            <Button
              variant="destructive"
              onClick={() => setShowClearDialog(true)}
              className="gap-2 w-full sm:w-auto"
            >
              <Trash2 className="h-4 w-4" /> Clear Data
            </Button>
          </div>
        </div>

        {/* Previous Records */}
        <Card className="backdrop-blur-sm bg-background/80">
          <CardHeader>
            <CardTitle>Previous Records</CardTitle>
            <CardDescription>View and export past attendance data</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {uniqueDates.map((recordDate) => {
                const dateStats = getDailyStats(recordDate);
                return (
                  <div
                    key={recordDate}
                    className="p-4 rounded-lg border bg-card hover:bg-accent cursor-pointer transition-colors"
                    onClick={() => setDate(recordDate)}
                  >
                    <p className="font-medium">{recordDate}</p>
                    <div className="mt-2 text-sm text-muted-foreground">
                      <p>Total: {dateStats.total}</p>
                      <p>On Time: {dateStats.onTime}</p>
                      <p>Late: {dateStats.late}</p>
                    </div>
                  </div>
                );
              })}
              {uniqueDates.length === 0 && (
                <p className="text-muted-foreground text-sm col-span-full text-center py-4">
                  No previous records found
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card className="backdrop-blur-sm bg-background/80">
            <CardHeader>
              <CardTitle>Today's Overview</CardTitle>
              <CardDescription>{date}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-2 bg-secondary/50 rounded-lg">
                  <span>Total Prefects</span>
                  <span className="font-bold text-lg">{stats?.total || 0}</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-green-500/10 rounded-lg">
                  <span>On Time</span>
                  <span className="font-bold text-lg text-green-500">
                    {stats?.onTime || 0}
                  </span>
                </div>
                <div className="flex justify-between items-center p-2 bg-red-500/10 rounded-lg">
                  <span>Late</span>
                  <span className="font-bold text-lg text-red-500">
                    {stats?.late || 0}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="backdrop-blur-sm bg-background/80">
            <CardHeader>
              <CardTitle>Attendance List</CardTitle>
              <CardDescription>All records for {date}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-[300px] overflow-y-auto">
                {filteredRecords.map((record) => (
                  <div
                    key={record.id}
                    className="flex justify-between items-center p-2 bg-secondary/50 rounded-lg"
                  >
                    <div className="flex flex-col">
                      <span className="font-medium">{record.prefectNumber}</span>
                      <span className="text-sm text-muted-foreground">
                        {record.role}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-sm">
                        {new Date(record.timestamp).toLocaleTimeString()}
                      </span>
                      <span className="block text-xs text-muted-foreground">
                        {new Date(record.timestamp).getHours() >= 7 &&
                        new Date(record.timestamp).getMinutes() > 0
                          ? 'Late'
                          : 'On Time'}
                      </span>
                    </div>
                  </div>
                ))}
                {filteredRecords.length === 0 && (
                  <p className="text-muted-foreground text-sm text-center py-4">
                    No records found
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="backdrop-blur-sm bg-background/80">
            <CardHeader>
              <CardTitle>Role Distribution</CardTitle>
              <CardDescription>Attendance by role</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {stats &&
                  Object.entries(stats.byRole).map(([role, count]) => (
                    <div
                      key={role}
                      className="flex justify-between items-center p-2 bg-secondary/50 rounded-lg"
                    >
                      <span>{role}</span>
                      <span className="font-bold">{count}</span>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <AlertDialog open={showClearDialog} onOpenChange={setShowClearDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Clear All Data?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete all
              attendance records.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleClearData}
              className="bg-destructive text-destructive-foreground"
            >
              Clear Data
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}