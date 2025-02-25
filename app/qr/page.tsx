'use client';

import { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Html5QrcodeScanner, Html5QrcodeSupportedFormats } from 'html5-qrcode';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { saveAttendance } from '@/lib/attendance';
import { PrefectRole } from '@/lib/types';
import { QrCode, Scan, Download, Shield, Printer } from 'lucide-react';
import { motion } from 'framer-motion';

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
  const [cameraAvailable, setCameraAvailable] = useState<boolean | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const generateQRCode = () => {
    if (!prefectNumber || !role) {
      toast.error('Missing Information', {
        description: 'Please enter prefect number and select role',
      });
      return;
    }

    setIsGenerating(true);
    setTimeout(() => {
      const data = {
        type: 'prefect_attendance',
        prefectNumber,
        role,
        hash: btoa(`${prefectNumber}_${role}`),
      };
      setQrData(JSON.stringify(data));
      setIsGenerating(false);
    }, 1000);
  };

  const downloadQRCode = () => {
    if (!qrData) {
      toast.error('No QR Code', {
        description: 'Please generate a QR code first',
      });
      return;
    }

    setIsDownloading(true);
    setTimeout(() => {
      const svgElement = document.querySelector('svg');
      if (!svgElement) return;

      const svgData = new XMLSerializer().serializeToString(svgElement);
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        toast.error('Failed to create canvas context');
        setIsDownloading(false);
        return;
      }

      const img = new Image();
      img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.fillStyle = '#FFFFFF'; // Set background to white
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);

        const pngUrl = canvas.toDataURL('image/png').replace('image/png', 'image/octet-stream');
        const downloadLink = document.createElement('a');
        downloadLink.href = pngUrl;
        downloadLink.download = `prefect_qr_${prefectNumber}.png`;
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);

        toast.success('QR Code Downloaded', {
          description: 'The QR code has been saved to your device',
        });
        setIsDownloading(false);
      };
    }, 1000);
  };

  const printQRCode = () => {
    if (!qrData) {
      toast.error('No QR Code', {
        description: 'Please generate a QR code first',
      });
      return;
    }

    const canvas = document.querySelector('canvas');
    if (!canvas) return;

    const imgDataUrl = canvas.toDataURL();

    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`<img src="${imgDataUrl}" alt="QR Code" />`);
      printWindow.document.close();
      printWindow.print();
    }
  };

  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: true })
      .then(() => {
        setCameraAvailable(true);
      })
      .catch(() => {
        setCameraAvailable(false);
      });
  }, []);

  useEffect(() => {
    if (cameraAvailable && !scannerInitialized) {
      const qrReaderElement = document.getElementById('qr-reader');
      if (qrReaderElement) {
        const scanner = new Html5QrcodeScanner('qr-reader', {
          formatsToSupport: [Html5QrcodeSupportedFormats.QR_CODE],
          qrbox: {
            width: 300,
            height: 300,
          },
          fps: 10,
        }, false);

        scanner.render(onScanSuccess, onScanError);
        setScannerInitialized(true);

        return () => {
          scanner.clear();
        };
      }
    }
  }, [cameraAvailable, scannerInitialized]);

  const onScanSuccess = (decodedText: string) => {
    try {
      const data = JSON.parse(decodedText);
      
      if (!data || data.type !== 'prefect_attendance') {
        throw new Error('Invalid QR code type');
      }

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
                <Button onClick={generateQRCode} className="w-full gap-2" disabled={isGenerating}>
                  <Shield className="h-4 w-4" />
                  {isGenerating ? 'Generating...' : 'Generate QR Code'}
                </Button>
              </div>

              {qrData && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                  className="flex flex-col items-center space-y-4"
                >
                  <div className="p-4 bg-white rounded-lg shadow-lg">
                    <QRCodeSVG
                      value={qrData}
                      size={300}
                      level="H"
                      includeMargin
                      bgColor="#FFFFFF"
                      fgColor="#000000"
                    />
                  </div>
                  <Button onClick={downloadQRCode} variant="outline" className="gap-2" disabled={isDownloading}>
                    <Download className="h-4 w-4" />
                    {isDownloading ? 'Downloading...' : 'Download QR Code'}
                  </Button>
                  <Button onClick={printQRCode} variant="outline" className="gap-2">
                    <Printer className="h-4 w-4" />
                    Print QR Code
                  </Button>
                  <p className="text-sm text-muted-foreground text-center">
                    QR code is valid for a lifetime
                  </p>
                </motion.div>
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
              {cameraAvailable === false && (
                <p className="text-center text-sm text-muted-foreground">
                  No camera detected. Please connect a camera and refresh the page.
                </p>
              )}
              {cameraAvailable === true && (
                <div id="qr-reader" className="mx-auto max-w-sm" />
              )}
              {cameraAvailable === null && (
                <p className="text-center text-sm text-muted-foreground mt-4">
                  Checking for camera availability...
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}