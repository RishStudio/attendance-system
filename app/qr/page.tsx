'use client';

import { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { saveAttendance } from '@/lib/attendance';
import { PrefectRole } from '@/lib/types';
import { QrCode, Scan, Download, Shield } from 'lucide-react';

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

export default function QRCodePage() {
  const [prefectNumber, setPrefectNumber] = useState('');
  const [role, setRole] = useState<PrefectRole | ''>('');
  const [qrData, setQrData] = useState('');
  const [scannerInitialized, setScannerInitialized] = useState(false);

  const generateQRCode = () => {
    if (!prefectNumber || !role) {
      toast.error('Missing Information', {
        description: 'Please enter prefect number and select role',
      });
      return;
    }

    const data = {
      type: 'prefect_attendance',
      prefectNumber,
      role,
      hash: btoa(`${prefectNumber}_${role}`),
    };
    setQrData(JSON.stringify(data));
  };

  const downloadQRCode = () => {
    if (!qrData) {
      toast.error('No QR Code', {
        description: 'Please generate a QR code first',
      });
      return;
    }

    const canvas = document.querySelector('canvas');
    if (!canvas) return;

    const pngUrl = canvas
      .toDataURL('image/png')
      .replace('image/png', 'image/octet-stream');
    
    const downloadLink = document.createElement('a');
    downloadLink.href = pngUrl;
    downloadLink.download = `prefect_qr_${prefectNumber}.png`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);

    toast.success('QR Code Downloaded', {
      description: 'The QR code has been saved to your device',
    });
  };

  useEffect(() => {
    if (!scannerInitialized) {
      const qrReaderElement = document.getElementById('qr-reader');
      if (qrReaderElement) {
        const scanner = new Html5QrcodeScanner('qr-reader', {
          qrbox: {
            width: 250,
            height: 250,
          },
          fps: 10,
        }, false); // Adding the verbose argument

        scanner.render(onScanSuccess, onScanError);
        setScannerInitialized(true);

        return () => {
          scanner.clear();
        };
      }
    }
  }, [scannerInitialized]);

  const onScanSuccess = (decodedText: string) => {
    try {
      const data = JSON.parse(decodedText);
      
      if (!data || data.type !== 'prefect_attendance') {
        throw new Error('Invalid QR code type');
      }

      // Save attendance
      const record = saveAttendance(data.prefectNumber, data.role);
      const time = new Date(record.timestamp);
      const isLate = time.getHours() >= 7 && time.getMinutes() > 0;

      toast.success('Attendance Marked Successfully', {
        description: `${data.role} ${data.prefectNumber} marked at ${time.toLocaleTimeString()}`,
      });

      if (isLate) {
        toast.warning('Late Arrival Detected', {
          description: 'Your attendance has been marked as late (after 7:00 AM)',
        });
      }

    } catch (error) {
      toast.error('Invalid QR Code', {
        description: error instanceof Error ? error.message : 'Failed to process QR code',
      });
    }
  };

  const onScanError = (error: any) => {
    // Only show errors that aren't related to normal scanning process
    if (error?.message?.includes('No QR code found')) return;
    
    toast.error('Scan Error', {
      description: 'Failed to scan QR code. Please try again.',
    });
  };

  return (
    <div className="container py-10">
      <Tabs defaultValue="generate" className="max-w-4xl mx-auto">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="generate" className="flex items-center gap-2">
            <QrCode className="h-4 w-4" />
            Generate QR Code
          </TabsTrigger>
          <TabsTrigger value="scan" className="flex items-center gap-2">
            <Scan className="h-4 w-4" />
            Scan QR Code
          </TabsTrigger>
        </TabsList>

        <TabsContent value="generate">
          <Card>
            <CardHeader>
              <CardTitle>Generate Attendance QR Code</CardTitle>
              <CardDescription>
                Create a QR code for prefect attendance
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Select value={role} onValueChange={(value) => setRole(value as PrefectRole)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select prefect role" />
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
                <div>
                  <Input
                    type="text"
                    placeholder="Enter prefect number"
                    value={prefectNumber}
                    onChange={(e) => setPrefectNumber(e.target.value)}
                  />
                </div>
                <Button onClick={generateQRCode} className="w-full gap-2">
                  <Shield className="h-4 w-4" />
                  Generate QR Code
                </Button>
              </div>

              {qrData && (
                <div className="flex flex-col items-center space-y-4">
                  <div className="p-4 bg-white rounded-lg">
                    <QRCodeSVG
                      value={qrData}
                      size={256}
                      level="H"
                      includeMargin
                    />
                  </div>
                  <Button onClick={downloadQRCode} variant="outline" className="gap-2">
                    <Download className="h-4 w-4" />
                    Download QR Code
                  </Button>
                  <p className="text-sm text-muted-foreground text-center">
                    QR code is valid for a lifetime
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="scan">
          <Card>
            <CardHeader>
              <CardTitle>Scan Attendance QR Code</CardTitle>
              <CardDescription>
                Scan the QR code to mark your attendance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div id="qr-reader" className="mx-auto max-w-sm" />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}