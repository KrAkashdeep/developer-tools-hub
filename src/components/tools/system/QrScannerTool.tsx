'use client';

import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { IconCamera, IconCameraOff, IconUpload, IconX, IconCopy, IconShield, IconAlertTriangle } from '@tabler/icons-react';
import CollapsibleGuide from '@/components/common/CollapsibleGuide';

// html5-qrcode types
interface Html5QrcodeScanner {
  render: (
    qrCodeSuccessCallback: (decodedText: string, decodedResult: any) => void,
    qrCodeErrorCallback?: (errorMessage: string) => void
  ) => void;
  clear: () => Promise<void>;
  getState: () => number;
}

// Dynamic import for html5-qrcode
let Html5Qrcode: any = null;
let Html5QrcodeScanner: any = null;

interface ScannedItem {
  data: string;
  timestamp: Date;
}

export default function QrScannerTool() {
  const [isScanning, setIsScanning] = useState(false);
  const [scannedData, setScannedData] = useState<ScannedItem[]>([]);
  const [error, setError] = useState('');
  const [isLibraryLoaded, setIsLibraryLoaded] = useState(false);
  const [scanningStatus, setScanningStatus] = useState('Ready to scan');
  const [isSecureContext, setIsSecureContext] = useState(false);
  const [cameraPermission, setCameraPermission] = useState<'unknown' | 'granted' | 'denied'>('unknown');
  
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const readerElementId = 'qr-reader';

  useEffect(() => {
    // Check secure context (HTTPS or localhost)
    const checkSecureContext = () => {
      const isSecure = window.isSecureContext || 
                      window.location.protocol === 'https:' || 
                      window.location.hostname === 'localhost' ||
                      window.location.hostname === '127.0.0.1';
      setIsSecureContext(isSecure);
      
      if (!isSecure) {
        setError('Camera access requires HTTPS or localhost. Please use a secure connection.');
      }
    };

    // Load html5-qrcode library dynamically
    const loadHtml5Qrcode = async () => {
      try {
        // Check if html5-qrcode is already loaded
        if ((window as any).Html5Qrcode) {
          Html5Qrcode = (window as any).Html5Qrcode;
          setIsLibraryLoaded(true);
          return;
        }

        // Load html5-qrcode from CDN
        const script = document.createElement('script');
        script.src = 'https://unpkg.com/html5-qrcode@2.3.8/html5-qrcode.min.js';
        script.onload = () => {
          Html5Qrcode = (window as any).Html5Qrcode;
          Html5QrcodeScanner = (window as any).Html5QrcodeScanner;
          setIsLibraryLoaded(true);
          console.log('html5-qrcode library loaded successfully');
        };
        script.onerror = () => {
          setError('Failed to load QR scanning library. Please check your internet connection.');
        };
        document.head.appendChild(script);
      } catch (err) {
        setError('Failed to initialize QR scanner library');
      }
    };

    // Check camera permissions
    const checkCameraPermission = async () => {
      if (!navigator.permissions) {
        setCameraPermission('unknown');
        return;
      }

      try {
        const permission = await navigator.permissions.query({ name: 'camera' as PermissionName });
        setCameraPermission(permission.state as 'granted' | 'denied');
        
        permission.addEventListener('change', () => {
          setCameraPermission(permission.state as 'granted' | 'denied');
        });
      } catch (err) {
        console.log('Permission query not supported:', err);
        setCameraPermission('unknown');
      }
    };

    checkSecureContext();
    loadHtml5Qrcode();
    checkCameraPermission();

    // Add CSS for html5-qrcode styling
    const addCustomStyles = () => {
      const styleId = 'qr-scanner-styles';
      if (!document.getElementById(styleId)) {
        const style = document.createElement('style');
        style.id = styleId;
        style.textContent = `
          #${readerElementId} {
            border: none !important;
            background: transparent !important;
          }
          
          #${readerElementId} video {
            width: 100% !important;
            height: auto !important;
            border-radius: 8px !important;
            border: 2px solid #e5e7eb !important;
            background-color: #000 !important;
            display: block !important;
            max-height: 400px !important;
          }
          
          #${readerElementId} > div {
            border: none !important;
            background: transparent !important;
          }
          
          #${readerElementId} canvas {
            border-radius: 8px !important;
          }
          
          #${readerElementId} select {
            margin: 10px 0 !important;
            padding: 5px !important;
            border-radius: 4px !important;
            border: 1px solid #ccc !important;
          }
          
          #${readerElementId} button {
            margin: 5px !important;
            padding: 8px 16px !important;
            border-radius: 6px !important;
            border: none !important;
            background: #3b82f6 !important;
            color: white !important;
            cursor: pointer !important;
          }
          
          #${readerElementId} button:hover {
            background: #2563eb !important;
          }
        `;
        document.head.appendChild(style);
      }
    };

    addCustomStyles();

    return () => {
      // Cleanup scanner on unmount
      if (scannerRef.current) {
        stopScanning();
      }
    };
  }, []);

  const startScanning = async () => {
    // Check prerequisites
    if (!isSecureContext) {
      setError('Camera access requires HTTPS or localhost. Please use a secure connection.');
      return;
    }

    if (!isLibraryLoaded || !Html5QrcodeScanner) {
      setError('QR scanning library is not loaded yet. Please wait and try again.');
      return;
    }

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setError('Camera API not supported in this browser. Please use a modern browser.');
      return;
    }

    try {
      setError('');
      setScanningStatus('Initializing camera...');

      // Stop any existing scanner
      if (scannerRef.current) {
        await stopScanning();
      }

      // Success callback - called when QR code is detected
      const onScanSuccess = (decodedText: string, decodedResult: any) => {
        console.log('QR Code detected:', decodedText);
        setScanningStatus('QR Code detected! Stopping scanner...');
        
        // Add scanned data
        addScannedData(decodedText);
        
        // Stop scanning after successful scan
        stopScanning();
      };

      // Error callback - called when scanning fails (optional)
      const onScanFailure = (error: string) => {
        // Don't log every scan failure as it's normal when no QR code is visible
        // Only update status if we're still scanning
        if (isScanning) {
          setScanningStatus('Scanning for QR codes...');
        }
      };

      // Scanner configuration
      const config = {
        fps: 10, // Frames per second
        qrbox: { width: 250, height: 250 }, // QR code scanning box
        aspectRatio: 1.0,
        disableFlip: false,
        videoConstraints: {
          facingMode: "environment", // Prefer back camera on mobile
          width: { ideal: 640, max: 1280 },
          height: { ideal: 480, max: 720 }
        },
        // UI configuration
        showTorchButtonIfSupported: true,
        showZoomSliderIfSupported: true,
        defaultZoomValueIfSupported: 2,
      };

      // Create new scanner instance with UI
      scannerRef.current = new Html5QrcodeScanner(readerElementId, config, false);

      // Render the scanner (this will show the camera UI)
      if (scannerRef.current) {
        scannerRef.current.render(onScanSuccess, onScanFailure);
      }

      setIsScanning(true);
      setScanningStatus('Camera starting - please allow camera access');
      setCameraPermission('granted');

      // Monitor for successful camera start
      setTimeout(() => {
        const videoElement = document.querySelector(`#${readerElementId} video`) as HTMLVideoElement;
        if (videoElement) {
          setScanningStatus('Camera active - point at QR code to scan');
          console.log('Camera video element found and active');
        } else {
          setScanningStatus('Waiting for camera to start...');
        }
      }, 2000);

    } catch (err) {
      console.error('Camera access error:', err);
      let errorMessage = 'Unable to access camera. ';
      
      if (err instanceof Error) {
        if (err.message.includes('NotAllowedError') || err.message.includes('Permission denied')) {
          errorMessage = 'Camera permission denied. Please allow camera access and try again.';
          setCameraPermission('denied');
        } else if (err.message.includes('NotFoundError')) {
          errorMessage = 'No camera found on this device.';
        } else if (err.message.includes('NotSupportedError')) {
          errorMessage = 'Camera not supported in this browser.';
        } else if (err.message.includes('NotReadableError')) {
          errorMessage = 'Camera is already in use by another application.';
        } else if (err.message.includes('OverconstrainedError')) {
          errorMessage = 'Camera constraints not supported. Try a different device.';
        } else {
          errorMessage += err.message;
        }
      }
      
      setError(errorMessage);
      setScanningStatus('Camera access failed');
      setIsScanning(false);
      
      // Clean up scanner on error
      if (scannerRef.current) {
        try {
          await scannerRef.current.clear();
        } catch (clearError) {
          console.log('Error clearing scanner:', clearError);
        }
        scannerRef.current = null;
      }
    }
  };

  const stopScanning = async () => {
    if (scannerRef.current) {
      try {
        await scannerRef.current.clear();
        console.log('Scanner stopped and cleared successfully');
      } catch (err) {
        console.log('Error stopping scanner:', err);
      }
      scannerRef.current = null;
    }
    
    setIsScanning(false);
    setScanningStatus('Scanning stopped');
  };



  const addScannedData = (data: string) => {
    setScannedData(prev => {
      // Check if this data was already scanned recently (within 5 seconds)
      const recentScan = prev.find(item => 
        item.data === data && 
        Date.now() - item.timestamp.getTime() < 5000
      );
      
      if (recentScan) {
        return prev; // Don't add duplicate
      }
      
      return [{ data, timestamp: new Date() }, ...prev];
    });
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file (JPG, PNG, etc.)');
      return;
    }

    if (!isLibraryLoaded || !Html5Qrcode) {
      setError('QR scanning library is not loaded yet. Please wait and try again.');
      return;
    }

    try {
      setError('');
      setScanningStatus('Processing uploaded image...');

      // Use html5-qrcode to scan the uploaded file
      const html5QrCode = new Html5Qrcode(readerElementId);
      
      const result = await html5QrCode.scanFile(file, true);
      
      if (result) {
        addScannedData(result);
        setScanningStatus('QR code found in uploaded image');
        setError('');
      } else {
        setError('No QR code found in the uploaded image');
        setScanningStatus('No QR code detected');
      }
      
      // Clean up
      await html5QrCode.clear();
      
    } catch (err) {
      console.error('File scan error:', err);
      setError('Could not process the uploaded image. Please try a different image.');
      setScanningStatus('Image processing failed');
    }
    
    // Reset file input
    event.target.value = '';
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch (err) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
    }
  };

  const clearHistory = () => {
    setScannedData([]);
  };

  const removeScannedItem = (index: number) => {
    setScannedData(prev => prev.filter((_, i) => i !== index));
  };

  const isUrl = (text: string) => {
    try {
      new URL(text);
      return true;
    } catch {
      return false;
    }
  };

  const getDataType = (data: string) => {
    if (isUrl(data)) return 'URL';
    if (data.includes('@') && data.includes('.') && !data.includes(' ')) return 'Email';
    if (data.startsWith('WIFI:') || data.startsWith('WiFi:')) return 'WiFi';
    if (data.startsWith('tel:') || data.startsWith('TEL:')) return 'Phone';
    if (data.startsWith('sms:') || data.startsWith('SMS:')) return 'SMS';
    if (data.startsWith('mailto:')) return 'Email';
    if (data.startsWith('geo:')) return 'Location';
    if (data.startsWith('BEGIN:VCARD')) return 'Contact';
    if (data.startsWith('BEGIN:VEVENT')) return 'Event';
    return 'Text';
  };

  const formatTimestamp = (timestamp: Date) => {
    return timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  return (
    <div className="space-y-6">
      {/* Security Warning */}
      {!isSecureContext && (
        <Card className="border-amber-200 bg-amber-50 dark:bg-amber-900/20">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <IconShield className="h-5 w-5 text-amber-600" />
              <div>
                <div className="font-medium text-amber-800 dark:text-amber-200">Secure Connection Required</div>
                <div className="text-sm text-amber-700 dark:text-amber-300">
                  Camera access requires HTTPS or localhost. Please use a secure connection.
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Library Status */}
      {!isLibraryLoaded && (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-muted-foreground">Loading html5-qrcode library...</div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Camera Scanner */}
      <Card>
        <CardHeader>
          <CardTitle>QR Code Scanner</CardTitle>
          <CardDescription>
            Click "Start Camera" to scan QR codes in real-time, or upload an image file
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Permission Status */}
          {cameraPermission === 'denied' && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
              <div className="flex items-center gap-2">
                <IconAlertTriangle className="h-4 w-4 text-red-600" />
                <div className="text-sm text-red-800 dark:text-red-200">
                  Camera permission denied. Please allow camera access in your browser settings.
                </div>
              </div>
            </div>
          )}

          <div className="flex gap-2">
            <Button
              onClick={isScanning ? stopScanning : startScanning}
              className="flex items-center gap-2"
              disabled={!isLibraryLoaded || !isSecureContext}
            >
              {isScanning ? (
                <>
                  <IconCameraOff className="h-4 w-4" />
                  Stop Camera
                </>
              ) : (
                <>
                  <IconCamera className="h-4 w-4" />
                  Start Camera
                </>
              )}
            </Button>
            
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
            />
            <Button
              onClick={() => fileInputRef.current?.click()}
              variant="outline"
              className="flex items-center gap-2"
              disabled={!isLibraryLoaded}
            >
              <IconUpload className="h-4 w-4" />
              Upload Image
            </Button>
          </div>

          {/* Status */}
          {(isScanning || scanningStatus !== 'Ready to scan') && (
            <div className="text-sm text-muted-foreground">
              Status: {scanningStatus}
            </div>
          )}

          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
              <div className="text-destructive text-sm font-medium mb-2">Error</div>
              <div className="text-destructive text-sm mb-3">{error}</div>
              
              <div className="text-xs text-muted-foreground">
                <strong>Troubleshooting:</strong>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>Ensure you're using HTTPS or localhost</li>
                  <li>Allow camera permissions when prompted</li>
                  <li>Close other apps using your camera</li>
                  <li>Try refreshing the page</li>
                  <li>Use "Upload Image" as an alternative</li>
                </ul>
              </div>
            </div>
          )}

          {/* Camera View - Html5QrcodeScanner will inject the complete UI here */}
          <div className="w-full max-w-lg mx-auto">
            <div 
              id={readerElementId}
              className="w-full"
            />
          </div>
          
          {/* Status display */}
          {isScanning && (
            <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
              <div className="flex items-center justify-center gap-2">
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                <span className="text-sm text-blue-800 dark:text-blue-200">{scanningStatus}</span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Scanned Results */}
      {scannedData.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Scanned QR Codes ({scannedData.length})</CardTitle>
              <Button onClick={clearHistory} size="sm" variant="outline">
                Clear All
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {scannedData.map((item, index) => (
                <div key={index} className="p-3 border rounded-lg">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline">{getDataType(item.data)}</Badge>
                        <span className="text-xs text-muted-foreground">
                          {formatTimestamp(item.timestamp)}
                        </span>
                      </div>
                      <div className="font-mono text-sm break-all">
                        {isUrl(item.data) ? (
                          <a 
                            href={item.data} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline"
                          >
                            {item.data}
                          </a>
                        ) : (
                          item.data
                        )}
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <Button
                        onClick={() => copyToClipboard(item.data)}
                        size="sm"
                        variant="ghost"
                        title="Copy to clipboard"
                      >
                        <IconCopy className="h-4 w-4" />
                      </Button>
                      <Button
                        onClick={() => removeScannedItem(index)}
                        size="sm"
                        variant="ghost"
                        title="Remove"
                      >
                        <IconX className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Documentation */}
      <CollapsibleGuide title="QR Code Scanner Guide">
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold mb-2">How to use:</h4>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
              <li><strong>Camera scanning:</strong> Click "Start Camera" and point at a QR code</li>
              <li><strong>Image upload:</strong> Upload an image containing a QR code</li>
              <li><strong>Auto-stop:</strong> Camera stops automatically after successful scan</li>
              <li><strong>Results:</strong> Scanned data appears below with type detection</li>
              <li><strong>Actions:</strong> Copy data or open URLs directly</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-2">Requirements:</h4>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
              <li><strong>HTTPS:</strong> Secure connection required (or localhost for development)</li>
              <li><strong>Permissions:</strong> Camera access must be granted by user</li>
              <li><strong>Modern browser:</strong> Chrome 53+, Firefox 36+, Safari 11+, Edge 12+</li>
              <li><strong>Camera:</strong> Working camera device (built-in or external)</li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-2">Supported QR code types:</h4>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
              <li><strong>URLs:</strong> Website links (automatically clickable)</li>
              <li><strong>Text:</strong> Plain text content</li>
              <li><strong>Email:</strong> Email addresses and mailto links</li>
              <li><strong>WiFi:</strong> Network credentials (WIFI: format)</li>
              <li><strong>Phone:</strong> Phone numbers (tel: format)</li>
              <li><strong>SMS:</strong> Text message data</li>
              <li><strong>Location:</strong> GPS coordinates (geo: format)</li>
              <li><strong>Contact:</strong> vCard contact information</li>
              <li><strong>Event:</strong> Calendar events</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-2">Features:</h4>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
              <li>Real-time QR code detection using html5-qrcode library</li>
              <li>Automatic camera selection (prefers back camera on mobile)</li>
              <li>Auto-stop after successful scan to save battery</li>
              <li>Support for various QR code formats and encodings</li>
              <li>Timestamp tracking for all scanned codes</li>
              <li>One-click copy to clipboard</li>
              <li>Duplicate prevention (5-second cooldown)</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-2">Mobile optimization:</h4>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
              <li>Automatically uses back camera (environment facing)</li>
              <li>Optimized video constraints for mobile devices</li>
              <li>Touch-friendly interface</li>
              <li>Works in mobile browsers (Safari, Chrome, Firefox)</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-2">Privacy & Security:</h4>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
              <li>All scanning is done locally using html5-qrcode library</li>
              <li>No data is sent to external servers</li>
              <li>Camera access requires explicit user permission</li>
              <li>Camera stops automatically after scan to protect privacy</li>
              <li>Be cautious when opening URLs from unknown QR codes</li>
              <li>Scan history is stored locally and can be cleared anytime</li>
            </ul>
          </div>

          <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded text-sm">
            <strong>Production Ready:</strong> This scanner uses the html5-qrcode library with 
            proper camera management, mobile optimization, and security best practices.
          </div>
        </div>
      </CollapsibleGuide>
    </div>
  );
}