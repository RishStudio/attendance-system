'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Html5Qrcode } from 'html5-qrcode';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { saveAttendance } from '@/lib/attendance';
import { PrefectRole } from '@/lib/types';
import {
  QrCode,
  ScanLine,
  Download,
  Shield,
  Printer,
  Loader,
  RefreshCw,
  Upload,
  Camera,
  CameraOff,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const roles: PrefectRole[] = [
  'Head',
  'Deputy',
  'Senior Executive',
  'Executive',
  'Super Senior',
  'Senior',
  'Junior',
  'Sub',
  'Apprentice',
];

export default function QRCodePage() {
  const [prefectNumber, setPrefectNumber] = useState('');
  const [role, setRole] = useState<PrefectRole | ''>('');
  const [qrData, setQrData] = useState('');
  const [cameraAvailable, setCameraAvailable] = useState<boolean | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [isWaitingForScan, setIsWaitingForScan] = useState(false);
  const [selectedCamera, setSelectedCamera] = useState('');
  const [cameras, setCameras] = useState<{ id: string; label: string }[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const html5QrCodeRef = useRef<Html5Qrcode | null>(null);
  const qrContainerRef = useRef<HTMLDivElement>(null);

  // Helper: Convert QRCode SVG to PNG data URL
  const getQRCodeImageData = useCallback(async (): Promise<string> => {
    const svgElement = qrContainerRef.current?.querySelector('svg');
    if (!svgElement) throw new Error('QR code element not found');
    const svgData = new XMLSerializer().serializeToString(svgElement);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Could not create canvas context');

    const img = new Image();
    img.src = 'data:image/svg+xml;base64,' + btoa(svgData);

    return new Promise((resolve, reject) => {
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
        resolve(canvas.toDataURL('image/png'));
      };
      img.onerror = reject;
    });
  }, []);

  // Generate QR Code with our system identifier
  const generateQRCode = useCallback(() => {
    if (!prefectNumber || !role) {
      toast.error('Missing Information', {
        description: 'Please enter prefect number and select role',
      });
      return;
    }
    setIsGenerating(true);
    try {
      const qrSecret = process.env.NEXT_PUBLIC_QR_SECRET || 'secret';
      const data = {
        type: 'prefect_attendance',
        prefectNumber,
        role,
        system: 'our_app', // system identifier used to ensure authenticity
        hash: btoa(`${prefectNumber}_${role}_${qrSecret}`),
      };
      setQrData(JSON.stringify(data));
      toast.success('QR Code Generated', {
        description: 'Your attendance QR code is ready',
      });
    } catch (error) {
      console.error('QR generation failed:', error);
    } finally {
      setIsGenerating(false);
    }
  }, [prefectNumber, role]);

  const downloadQRCode = useCallback(async () => {
    if (!qrData) {
      toast.error('No QR Code', {
        description: 'Please generate a QR code first',
      });
      return;
    }
    setIsDownloading(true);
    try {
      const pngUrl = await getQRCodeImageData();
      const downloadLink = document.createElement('a');
      downloadLink.href = pngUrl;
      downloadLink.download = `prefect_qr_${prefectNumber}.png`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
      toast.success('QR Code Downloaded', {
        description: 'QR code has been saved to your device',
      });
    } catch (error) {
      console.error('Download error:', error);
    } finally {
      setIsDownloading(false);
    }
  }, [qrData, prefectNumber, getQRCodeImageData]);

  const printQRCode = useCallback(async () => {
    if (!qrData) {
      toast.error('No QR Code', {
        description: 'Please generate a QR code first',
      });
      return;
    }
    try {
      const pngUrl = await getQRCodeImageData();
      const printWindow = window.open('', '_blank');
      if (!printWindow) throw new Error('Failed to open print window');
      printWindow.document.write(`
        <html>
          <head>
            <title>Print QR Code</title>
            <style>
              body { margin: 0; display: flex; justify-content: center; align-items: center; height: 100vh; }
              img { max-width: 100%; height: auto; }
            </style>
          </head>
          <body>
            <img src="${pngUrl}" alt="QR Code" />
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    } catch (error) {
      console.error('Print error:', error);
    }
  }, [qrData, getQRCodeImageData]);

  // Initialize camera and update available status
  const initializeCamera = useCallback(async () => {
    try {
      const devices = await Html5Qrcode.getCameras();
      setCameras(devices.map((device) => ({ id: device.id, label: device.label })));
      setCameraAvailable(devices.length > 0);
      if (devices.length > 0) {
        setSelectedCamera(devices[0].id);
      } else {
        // No camera available; file upload will be used for scanning.
        setCameraAvailable(false);
      }
    } catch (error) {
      setCameraAvailable(false);
      console.error('Camera initialization error:', error);
    }
  }, []);

  // Process scan result and mark attendance if valid QR code
  const onScanSuccess = useCallback((decodedText: string) => {
    try {
      const data = JSON.parse(decodedText);
      // Validate that QR code is from our system
      if (!data || data.type !== 'prefect_attendance' || data.system !== 'our_app') {
        throw new Error('Unrecognized QR code');
      }
      const qrSecret = process.env.NEXT_PUBLIC_QR_SECRET || 'secret';
      const expectedHash = btoa(`${data.prefectNumber}_${data.role}_${qrSecret}`);
      if (data.hash !== expectedHash) {
        throw new Error('QR code signature mismatch');
      }
      const record = saveAttendance(data.prefectNumber, data.role);
      const time = new Date(record.timestamp);
      const isLate = time.getHours() >= 7 && time.getMinutes() > 0;
      toast.success('Attendance Marked Successfully', {
        description: `${data.role} ${data.prefectNumber} marked at ${time.toLocaleTimeString()}`,
      });
      if (isLate) {
        toast.warning('Late Arrival Detected', {
          description: 'Attendance marked as late (after 7:00 AM)',
        });
      }
      setIsWaitingForScan(false);
    } catch (error) {
      // Silently ignore errors, but log for debugging.
      console.debug('Scan processing error (ignored):', error);
    }
  }, []);

  // Silently ignore scan errors without disrupting the user experience.
  const onScanError = useCallback((error: any) => {
    console.debug('Scan error (ignored):', error);
    setIsWaitingForScan(true);
  }, []);

  const startScanner = useCallback(async () => {
    if (!selectedCamera) return;
    try {
      const html5QrCode = new Html5Qrcode('qr-reader');
      html5QrCodeRef.current = html5QrCode;
      setIsWaitingForScan(true);
      await html5QrCode.start(
        selectedCamera,
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
        },
        onScanSuccess,
        onScanError
      );
      setIsCameraActive(true);
    } catch (error) {
      console.error('Failed to start scanner:', error);
    }
  }, [selectedCamera, onScanSuccess, onScanError]);

  const stopScanner = useCallback(async () => {
    if (html5QrCodeRef.current && html5QrCodeRef.current.isScanning) {
      await html5QrCodeRef.current.stop();
      setIsCameraActive(false);
      setIsWaitingForScan(false);
    }
  }, []);

  const handleFileUpload = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;
      setIsUploading(true);
      try {
        if (!html5QrCodeRef.current) {
          html5QrCodeRef.current = new Html5Qrcode('qr-reader');
        }
        const result = await html5QrCodeRef.current.scanFile(file, true);
        // If scanning via file upload is successful, mark attendance.
        onScanSuccess(result);
      } catch (error) {
        console.error('File upload scan error:', error);
      } finally {
        setIsUploading(false);
      }
    },
    [onScanSuccess]
  );

  useEffect(() => {
    initializeCamera();
    return () => {
      stopScanner();
    };
  }, [initializeCamera, stopScanner]);

  const handleKeyPress = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === 'Enter') {
        startScanner();
      }
    },
    [startScanner]
  );

  useEffect(() => {
    document.addEventListener('keydown', handleKeyPress);
    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, [handleKeyPress]);

  return (
    <div className="container py-10">
      <Tabs defaultValue="generate" className="max-w-4xl mx-auto">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="generate" className="flex items-center gap-2">
            <QrCode className="h-4 w-4" />
            Generate QR Code
          </TabsTrigger>
          <TabsTrigger value="scan" className="flex items-center gap-2">
            <ScanLine className="h-4 w-4" />
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
                  <Select
                    value={role}
                    onValueChange={(value) => setRole(value as PrefectRole)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select prefect role" />
                    </SelectTrigger>
                    <SelectContent>
                      {roles.map((r) => (
                        <SelectItem key={r} value={r}>
                          {r}
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
                <Button
                  onClick={generateQRCode}
                  className="w-full gap-2"
                  disabled={isGenerating}
                >
                  <Shield className="h-4 w-4" />
                  {isGenerating ? (
                    <>
                      <Loader className="h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    'Generate QR Code'
                  )}
                </Button>
              </div>

              <AnimatePresence>
                {qrData && (
                  <motion.div
                    ref={qrContainerRef}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.5 }}
                    className="flex flex-col items-center space-y-4"
                  >
                    <div className="p-6 bg-white rounded-lg shadow-lg">
                      <QRCodeSVG
                        value={qrData}
                        size={300}
                        level="H"
                        includeMargin
                        bgColor="#FFFFFF"
                        fgColor="#000000"
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={downloadQRCode}
                        variant="outline"
                        className="gap-2"
                        disabled={isDownloading}
                      >
                        <Download className="h-4 w-4" />
                        {isDownloading ? (
                          <>
                            <Loader className="h-4 w-4 animate-spin" />
                            Downloading...
                          </>
                        ) : (
                          'Download'
                        )}
                      </Button>
                      <Button
                        onClick={printQRCode}
                        variant="outline"
                        className="gap-2"
                      >
                        <Printer className="h-4 w-4" />
                        Print
                      </Button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="scan">
          <Card>
            <CardHeader>
              <CardTitle>Scan Attendance QR Code</CardTitle>
              <CardDescription>
                {cameraAvailable
                  ? 'Scan the QR code using your camera'
                  : 'Upload your QR code image to mark attendance'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {cameraAvailable === null ? (
                <div className="flex flex-col items-center justify-center p-8">
                  <Loader className="animate-spin h-8 w-8 mb-4" />
                  <p className="text-center text-sm text-muted-foreground">
                    Checking for camera availability...
                  </p>
                </div>
              ) : cameraAvailable ? (
                <div className="space-y-4">
                  <div className="flex gap-2">
                    <Select
                      value={selectedCamera}
                      onValueChange={setSelectedCamera}
                    >
                      <SelectTrigger className="flex-1">
                        <SelectValue placeholder="Select camera" />
                      </SelectTrigger>
                      <SelectContent>
                        {cameras.map((camera) => (
                          <SelectItem key={camera.id} value={camera.id}>
                            {camera.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button
                      variant="outline"
                      onClick={isCameraActive ? stopScanner : startScanner}
                      className="gap-2"
                    >
                      {isCameraActive ? (
                        <>
                          <CameraOff className="h-4 w-4" />
                          Stop Camera
                        </>
                      ) : (
                        <>
                          <Camera className="h-4 w-4" />
                          Start Camera
                        </>
                      )}
                    </Button>
                  </div>

                  <div id="qr-reader" className="overflow-hidden rounded-lg bg-black/5" />

                  {isWaitingForScan && (
                    <div className="flex flex-col items-center mt-4">
                      <Loader className="animate-spin h-8 w-8 mb-2" />
                      <span className="text-sm text-muted-foreground">
                        Waiting for QR scan...
                      </span>
                    </div>
                  )}

                  <div className="flex items-center gap-2">
                    <div className="flex-1 border-t border-border" />
                    <span className="text-xs text-muted-foreground px-2">OR</span>
                    <div className="flex-1 border-t border-border" />
                  </div>

                  <div className="flex justify-center">
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      ref={fileInputRef}
                      onChange={handleFileUpload}
                    />
                    <Button
                      variant="outline"
                      onClick={() => fileInputRef.current?.click()}
                      className="gap-2"
                      disabled={isUploading}
                    >
                      <Upload className="h-4 w-4" />
                      {isUploading ? (
                        <>
                          <Loader className="h-4 w-4 animate-spin" />
                          Uploading...
                        </>
                      ) : (
                        'Upload QR Code Image'
                      )}
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <p className="text-center text-sm text-muted-foreground mb-4">
                    No camera detected. Please upload your QR code image to mark attendance.
                  </p>
                  <div className="flex justify-center">
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      ref={fileInputRef}
                      onChange={handleFileUpload}
                    />
                    <Button
                      variant="outline"
                      onClick={() => fileInputRef.current?.click()}
                      className="gap-2"
                      disabled={isUploading}
                    >
                      <Upload className="h-4 w-4" />
                      {isUploading ? (
                        <>
                          <Loader className="h-4 w-4 animate-spin" />
                          Uploading...
                        </>
                      ) : (
                        'Upload QR Code Image'
                      )}
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}