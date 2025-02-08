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
  Edit2,
  Save,
  X,
  FileText,
  Clock,
  Users,
  BarChart,
  Filter,
  Lock,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { AttendanceRecord, DailyStats, PrefectRole } from '@/lib/types';
import { getAttendanceRecords, getDailyStats, exportAttendance, updateAttendance } from '@/lib/attendance';
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
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Clock as ClockComponent } from '@/components/ui/clock';

const roles: PrefectRole[] = [
  'Head',
  'Deputy',
  'Senior Executive',
  'Executive',
  'Super Senior',
  'Senior',
  'Junior',
  'Sub',
  'Apprentice'
];

export default function AdminPanel() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pin, setPin] = useState('');
  const [showPinDialog, setShowPinDialog] = useState(true);
  const [date, setDate] = useState(new Date().toLocaleDateString());
  const [stats, setStats] = useState<DailyStats | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredRecords, setFilteredRecords] = useState<AttendanceRecord[]>([]);
  const [allRecords, setAllRecords] = useState<AttendanceRecord[]>([]);
  const [showClearDialog, setShowClearDialog] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [uniqueDates, setUniqueDates] = useState<string[]>([]);
  const [editingRecord, setEditingRecord] = useState<string | null>(null);
  const [roleFilter, setRoleFilter] = useState<PrefectRole | 'all'>('all');
  const [editForm, setEditForm] = useState({
    prefectNumber: '',
    role: '' as PrefectRole | '',
    time: '',
    date: '',
  });

  const handlePinSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    
    if (pin === 'rishstudio') {
      setIsAuthenticated(true);
      setShowPinDialog(false);
      toast.success('Access Granted', {
        description: 'Welcome to the admin panel',
      });
    } else {
      toast.error('Invalid PIN', {
        description: 'Please enter the correct PIN to access the admin panel',
      });
      setPin('');
    }
  };

  useEffect(() => {
    if (!isAuthenticated) return;

    const records = getAttendanceRecords();
    setAllRecords(records);
    const todayRecords = records.filter(r => r.date === date);
    setFilteredRecords(todayRecords);
    setStats(getDailyStats(date));

    const dates = [...new Set(records.map(r => r.date))].sort((a, b) => 
      new Date(b).getTime() - new Date(a).getTime()
    );
    setUniqueDates(dates);

    const lastExport = localStorage.getItem('last_export_date');
    if (lastExport !== date) {
      toast('Daily Export Reminder', {
        description: 'Please remember to export today\'s attendance records before end of day.',
        icon: <AlertTriangle className="h-5 w-5 text-yellow-500" />,
        duration: 5000,
      });
    }
  }, [date, isAuthenticated]);

  useEffect(() => {
    if (!isAuthenticated) return;

    const filtered = allRecords.filter(record => {
      const matchesSearch = record.prefectNumber.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesDate = record.date === date;
      const matchesRole = roleFilter === 'all' || record.role === roleFilter;
      return matchesSearch && matchesDate && matchesRole;
    });
    setFilteredRecords(filtered);
  }, [searchQuery, date, allRecords, roleFilter, isAuthenticated]);

  useEffect(() => {
    const handleFullScreenChange = () => {
      setIsFullScreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullScreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullScreenChange);
  }, []);

  if (!isAuthenticated) {
    return (
      <Dialog open={showPinDialog} onOpenChange={setShowPinDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Enter Admin PIN</DialogTitle>
            <DialogDescription>
              Please enter the PIN to access the admin panel
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handlePinSubmit} className="space-y-4 py-4">
            <div className="flex items-center space-x-4">
              <Input
                type="password"
                placeholder="Enter PIN"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                autoFocus
              />
            </div>
            <div className="flex justify-end">
              <Button type="submit">
                <Lock className="mr-2 h-4 w-4" />
                Access Admin Panel
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    );
  }

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

  const startEditing = (record: AttendanceRecord) => {
    const timestamp = new Date(record.timestamp);
    setEditingRecord(record.id);
    setEditForm({
      prefectNumber: record.prefectNumber,
      role: record.role,
      date: timestamp.toISOString().split('T')[0],
      time: timestamp.toTimeString().split(' ')[0].slice(0, 5),
    });
  };

  const saveEdit = (id: string) => {
    try {
      const timestamp = new Date(`${editForm.date}T${editForm.time}`);
      if (isNaN(timestamp.getTime())) {
        throw new Error('Invalid date/time');
      }

      if (!editForm.role || !editForm.prefectNumber) {
        throw new Error('All fields are required');
      }

      const updatedRecord = updateAttendance(id, {
        prefectNumber: editForm.prefectNumber,
        role: editForm.role as PrefectRole,
        timestamp: timestamp.toISOString(),
        date: timestamp.toLocaleDateString(),
      });

      setAllRecords(prev => prev.map(r => r.id === id ? updatedRecord : r));
      setEditingRecord(null);
      
      toast.success('Record Updated', {
        description: 'The attendance record has been updated successfully.',
      });
    } catch (error) {
      toast.error('Update Failed', {
        description: error instanceof Error ? error.message : 'Failed to update the record.',
      });
    }
  };

  return (
    <div className="relative min-h-[calc(100vh-8rem)] p-4 sm:p-8">
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
            <Select value={roleFilter} onValueChange={(value) => setRoleFilter(value as PrefectRole | 'all')}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                {roles.map((role) => (
                  <SelectItem key={role} value={role}>{role}</SelectItem>
                ))}
              </SelectContent>
            </Select>
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

        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview" className="gap-2">
              <BarChart className="h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="records" className="gap-2">
              <FileText className="h-4 w-4" />
              Records
            </TabsTrigger>
            <TabsTrigger value="history" className="gap-2">
              <Clock className="h-4 w-4" />
              History
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <Card className="backdrop-blur-sm bg-background/80">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Today's Overview
                  </CardTitle>
                  <CardDescription>{date}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 bg-secondary/50 rounded-lg">
                      <span>Total Prefects</span>
                      <span className="font-bold text-lg">{stats?.total || 0}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-green-500/10 rounded-lg">
                      <span>On Time</span>
                      <span className="font-bold text-lg text-green-500">{stats?.onTime || 0}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-red-500/10 rounded-lg">
                      <span>Late</span>
                      <span className="font-bold text-lg text-red-500">{stats?.late || 0}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="backdrop-blur-sm bg-background/80">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart className="h-5 w-5" />
                    Role Distribution
                  </CardTitle>
                  <CardDescription>Attendance by role</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {stats && Object.entries(stats.byRole)
                      .filter(([_, count]) => count > 0)
                      .map(([role, count]) => (
                        <div key={role} className="flex justify-between items-center p-3 bg-secondary/50 rounded-lg">
                          <span>{role}</span>
                          <span className="font-bold">{count}</span>
                        </div>
                      ))
                    }
                    {(!stats || Object.values(stats.byRole).every(count => count === 0)) && (
                      <p className="text-muted-foreground text-sm text-center py-4">
                        No role distribution data available
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card className="backdrop-blur-sm bg-background/80">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Attendance Timeline
                  </CardTitle>
                  <CardDescription>Arrival pattern for {date}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {filteredRecords
                      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
                      .map((record, index) => {
                        const time = new Date(record.timestamp);
                        const isLate = time.getHours() >= 7 && time.getMinutes() > 0;
                        return (
                          <div
                            key={record.id}
                            className={`p-3 rounded-lg ${
                              isLate ? 'bg-red-500/10' : 'bg-green-500/10'
                            }`}
                          >
                            <div className="flex justify-between items-center">
                              <span className="text-sm font-medium">
                                {time.toLocaleTimeString()}
                              </span>
                              <span className={`text-sm ${
                                isLate ? 'text-red-500' : 'text-green-500'
                              }`}>
                                {isLate ? 'Late' : 'On Time'}
                              </span>
                            </div>
                            <div className="text-xs text-muted-foreground mt-1">
                              {record.prefectNumber} ({record.role})
                            </div>
                          </div>
                        );
                      })
                    }
                    {filteredRecords.length === 0 && (
                      <p className="text-muted-foreground text-sm text-center py-4">
                        No attendance records for this date
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="records">
            <Card className="backdrop-blur-sm bg-background/80">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Attendance Records
                </CardTitle>
                <CardDescription>All records for {date}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-[600px] overflow-y-auto">
                  {filteredRecords.map(record => (
                    <div key={record.id} className="flex justify-between items-center p-3 bg-secondary/50 rounded-lg">
                      {editingRecord === record.id ? (
                        <div className="w-full space-y-3">
                          <div className="flex gap-3">
                            <Input
                              value={editForm.prefectNumber}
                              onChange={(e) => setEditForm(prev => ({ ...prev, prefectNumber: e.target.value }))}
                              placeholder="Prefect Number"
                            />
                            <Select
                              value={editForm.role}
                              onValueChange={(value) => setEditForm(prev => ({ ...prev, role: value as PrefectRole }))}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Role" />
                              </SelectTrigger>
                              <SelectContent>
                                {roles.map((role) => (
                                  <SelectItem key={role} value={role}>
                                    {role}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="flex gap-3">
                            <Input
                              type="date"
                              value={editForm.date}
                              onChange={(e) => setEditForm(prev => ({ ...prev, date: e.target.value }))}
                            />
                            <Input
                              type="time"
                              value={editForm.time}
                              onChange={(e) => setEditForm(prev => ({ ...prev, time: e.target.value }))} />
                          </div>
                          <div className="flex justify-end gap-2">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => setEditingRecord(null)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => saveEdit(record.id)}
                            >
                              <Save className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="flex flex-col">
                            <span className="font-medium">{record.prefectNumber}</span>
                            <span className="text-sm text-muted-foreground">{record.role}</span>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="text-right">
                              <span className="text-sm">{new Date(record.timestamp).toLocaleTimeString()}</span>
                              <span className={`block text-xs ${
                                new Date(record.timestamp).getHours() >= 7 && 
                                new Date(record.timestamp).getMinutes() > 0
                                  ? 'text-red-500'
                                  : 'text-green-500'
                              }`}>
                                {new Date(record.timestamp).getHours() >= 7 && 
                                 new Date(record.timestamp).getMinutes() > 0 ? 'Late' : 'On Time'}
                              </span>
                            </div>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => startEditing(record)}
                            >
                              <Edit2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </>
                      )}
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
          </TabsContent>

          <TabsContent value="history">
            <Card className="backdrop-blur-sm bg-background/80">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Previous Records
                </CardTitle>
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
                        <div className="mt-2 space-y-1 text-sm text-muted-foreground">
                          <p className="flex justify-between">
                            <span>Total:</span>
                            <span>{dateStats.total}</span>
                          </p>
                          <p className="flex justify-between">
                            <span>On Time:</span>
                            <span className="text-green-500">{dateStats.onTime}</span>
                          </p>
                          <p className="flex justify-between">
                            <span>Late:</span>
                            <span className="text-red-500">{dateStats.late}</span>
                          </p>
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
          </TabsContent>
        </Tabs>
      </div>

      <AlertDialog open={showClearDialog} onOpenChange={setShowClearDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Clear All Data?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete all attendance records.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleClearData} className="bg-destructive text-destructive-foreground">
              Clear Data
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}