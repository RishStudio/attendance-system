'use client';

import { useState } from 'react';
import { Search, Download, User, Calendar, Clock, TrendingUp, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { searchPrefectRecords, getPrefectStats, exportPrefectReport } from '@/lib/attendance';
import { AttendanceRecord } from '@/lib/types';

interface PrefectStats {
  totalDays: number;
  onTimeDays: number;
  lateDays: number;
  attendanceRate: number;
  roles: Record<string, number>;
  recentRecords: AttendanceRecord[];
}

export function PrefectSearch() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<AttendanceRecord[]>([]);
  const [prefectStats, setPrefectStats] = useState<PrefectStats | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = () => {
    if (!searchQuery.trim()) {
      toast.error('Please enter a prefect number to search');
      return;
    }

    setIsSearching(true);
    try {
      const records = searchPrefectRecords(searchQuery.trim());
      const stats = getPrefectStats(searchQuery.trim());
      
      setSearchResults(records);
      setPrefectStats(stats);

      if (records.length === 0) {
        toast.info('No Records Found', {
          description: `No attendance records found for prefect ${searchQuery}`,
        });
      } else {
        toast.success('Search Complete', {
          description: `Found ${records.length} attendance records`,
        });
      }
    } catch (error) {
      toast.error('Search Failed', {
        description: 'An error occurred while searching for records',
      });
    } finally {
      setIsSearching(false);
    }
  };

  const handleExportReport = () => {
    if (!searchQuery.trim() || !searchResults.length) {
      toast.error('No data to export');
      return;
    }

    try {
      const csv = exportPrefectReport(searchQuery.trim());
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `prefect_${searchQuery.trim()}_report.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      
      toast.success('Report Exported', {
        description: 'Prefect attendance report has been downloaded',
      });
    } catch (error) {
      toast.error('Export Failed', {
        description: 'Could not export the report',
      });
    }
  };

  const getStatusColor = (timestamp: string) => {
    const time = new Date(timestamp);
    const isLate = time.getHours() >= 7 && time.getMinutes() > 0;
    return isLate ? 'destructive' : 'default';
  };

  const getStatusText = (timestamp: string) => {
    const time = new Date(timestamp);
    const isLate = time.getHours() >= 7 && time.getMinutes() > 0;
    return isLate ? 'Late' : 'On Time';
  };

  return (
    <div className="space-y-6">
      <Card className="backdrop-blur-sm bg-background/80 border border-white/10">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Search Prefect Records
          </CardTitle>
          <CardDescription>
            Search for a specific prefect's attendance history and generate detailed reports
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Enter prefect number (e.g., 64)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="pl-10 bg-background/50 border-white/20 backdrop-blur-sm"
              />
            </div>
            <Button 
              onClick={handleSearch} 
              disabled={isSearching}
              className="bg-primary/90 hover:bg-primary backdrop-blur-sm"
            >
              {isSearching ? 'Searching...' : 'Search'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {prefectStats && (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card className="backdrop-blur-sm bg-background/80 border border-white/10">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Total Days
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{prefectStats.totalDays}</div>
              <p className="text-xs text-muted-foreground">Attendance records</p>
            </CardContent>
          </Card>

          <Card className="backdrop-blur-sm bg-background/80 border border-white/10">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Clock className="h-4 w-4" />
                On Time
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-500">{prefectStats.onTimeDays}</div>
              <p className="text-xs text-muted-foreground">Days on time</p>
            </CardContent>
          </Card>

          <Card className="backdrop-blur-sm bg-background/80 border border-white/10">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Late
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-500">{prefectStats.lateDays}</div>
              <p className="text-xs text-muted-foreground">Days late</p>
            </CardContent>
          </Card>

          <Card className="backdrop-blur-sm bg-background/80 border border-white/10">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Rate
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{prefectStats.attendanceRate.toFixed(1)}%</div>
              <p className="text-xs text-muted-foreground">On-time rate</p>
            </CardContent>
          </Card>
        </div>
      )}

      {searchResults.length > 0 && (
        <Card className="backdrop-blur-sm bg-background/80 border border-white/10">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Prefect {searchQuery} - Attendance Records
                </CardTitle>
                <CardDescription>
                  {searchResults.length} total records found
                </CardDescription>
              </div>
              <Button 
                onClick={handleExportReport}
                className="gap-2 bg-primary/90 hover:bg-primary backdrop-blur-sm"
              >
                <Download className="h-4 w-4" />
                Export Report
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-[500px] overflow-y-auto">
              {searchResults.map((record) => (
                <div 
                  key={record.id} 
                  className="flex justify-between items-center p-4 rounded-lg bg-background/30 backdrop-blur-sm border border-white/10 hover:bg-background/40 transition-colors"
                >
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{record.role}</span>
                      <Badge variant={getStatusColor(record.timestamp)}>
                        {getStatusText(record.timestamp)}
                      </Badge>
                    </div>
                    <span className="text-sm text-muted-foreground">{record.date}</span>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">
                      {new Date(record.timestamp).toLocaleTimeString()}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {new Date(record.timestamp).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {prefectStats && Object.values(prefectStats.roles).some(count => count > 0) && (
        <Card className="backdrop-blur-sm bg-background/80 border border-white/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Role Distribution
            </CardTitle>
            <CardDescription>
              Breakdown of attendance by prefect role
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {Object.entries(prefectStats.roles)
                .filter(([_, count]) => count > 0)
                .map(([role, count]) => (
                  <div 
                    key={role} 
                    className="flex justify-between items-center p-3 rounded-lg bg-background/30 backdrop-blur-sm border border-white/10"
                  >
                    <span className="font-medium">{role}</span>
                    <Badge variant="outline">{count} days</Badge>
                  </div>
                ))
              }
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}