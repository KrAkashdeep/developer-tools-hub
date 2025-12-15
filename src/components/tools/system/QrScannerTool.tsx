'use client';

import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { IconCamera, IconCameraOff, IconUpload, IconX, IconCopy, IconClock } from '@tabler/icons-react';

// jsQR types
interface QRCode {
  data: string;
  location: {
    topLeftCorner: { x: number; y: number };
    topRightCorner: { x: number; y: number };
    bottomLeftCorner: { x: number; y: number };
    bottomRightCorner: { x: number; y: number };
  };
}

// Dynamic import for jsQR
let jsQR: ((data: Uint8ClampedArray, width: number, height: number, options?: any) => QRCode | null) | null = null;

interface ScannedItem {
  data: string;
  timestamp: Date;
}

export default function QrScannerTool() {
  const [isScanning, setIsScanning] = useState(false);
  const [scannedData, setScannedData] = useState<ScannedItem[]>([]);
  const [error, setError] = useState('');
  const [hasCamera, setHasCamera] = useState(false);
  const [isLibraryLoaded, setIsLibraryLoaded] = useState(false);
  const [scanningStatus, setScanningStatus] = useState('Ready to scan');
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const overlayCanvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const animationFrameRef = useRef<number | null>(null);

  useEffect(() => {
    // Load jsQR library dynamically
    const loadJsQR = async () => {
      try {
        // Check if jsQR is already loaded
        if ((window as any).jsQR) {
          jsQR = (window as any).jsQR;
          setIsLibraryLoaded(true);
          return;
        }

        // Try to load jsQR from CDN
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/jsqr@1.4.0/dist/jsQR.js';
        script.onload = () => {
          jsQR = (window as any).jsQR;
          setIsLibraryLoaded(true);
        };
        script.onerror = () => {
          setError('Failed to load QR scanning library. Please check your internet connection.');
        };
        document.head.appendChild(script);
      } catch (err) {
        setError('Failed to initialize QR scanner');
      }
    };

    loadJsQR();

    // Check if camera is available with better detection
    const checkCamera = async () => {
      try {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          setHasCamera(false);
          return;
        }

        // Try to enumerate devices first
        const devices = await navigator.mediaDevices.enumerateDevices();
        const hasVideoInput = devices.some(device => device.kind === 'videoinput');
        
        if (!hasVideoInput) {
          setHasCamera(false);
          return;
        }

        // Test camera access with minimal constraints
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: { width: 320, height: 240 } 
        });
        
        // Immediately stop the test stream
        stream.getTracks().forEach(track => track.stop());
        setHasCamera(true);
      } catch (err) {
        console.log('Camera check failed:', err);
        setHasCamera(false);
      }
    };

    checkCamera();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  const startScanning = async () => {
    if (!isLibraryLoaded) {
      setError('QR scanning library is not loaded yet. Please wait and try again.');
      return;
    }

    try {
      setError('');
      setScanningStatus('Requesting camera access...');
      
      // Try different constraint configurations for better compatibility
      const constraints = [
        // First try with back camera
        {
          video: {
            facingMode: { exact: 'environment' },
            width: { ideal: 1280, max: 1920 },
            height: { ideal: 720, max: 1080 }
          }
        },
        // Fallback to any camera
        {
          video: {
            facingMode: 'environment',
            width: { ideal: 640, max: 1280 },
            height: { ideal: 480, max: 720 }
          }
        },
        // Basic video constraints
        {
          video: {
            width: { ideal: 640 },
            height: { ideal: 480 }
          }
        },
        // Minimal constraints
        { video: true }
      ];

      let stream = null;
      let lastError = null;

      for (const constraint of constraints) {
        try {
          setScanningStatus('Trying camera configuration...');
          stream = await navigator.mediaDevices.getUserMedia(constraint);
          break;
        } catch (err) {
          lastError = err;
          console.log('Camera constraint failed, trying next...', err);
        }
      }

      if (!stream) {
        throw lastError || new Error('No camera access');
      }
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setIsScanning(true);
        setScanningStatus('Camera ready - point at QR code');
        
        // Wait for video to be ready
        videoRef.current.onloadedmetadata = () => {
          if (videoRef.current) {
            // Add a small delay to ensure video is fully loaded
            setTimeout(() => {
              if (videoRef.current) {
                videoRef.current.play().then(() => {
                  setScanningStatus('Camera active - scanning for QR codes...');
                  scanForQRCode();
                }).catch((playError) => {
                  console.error('Video play failed:', playError);
                  setError('Failed to start video playback. Please try again or refresh the page.');
                });
              }
            }, 100);
          }
        };

        // Also handle the case where metadata is already loaded
        if (videoRef.current.readyState >= 1) {
          setTimeout(() => {
            if (videoRef.current) {
              videoRef.current.play().then(() => {
                setScanningStatus('Camera active - scanning for QR codes...');
                scanForQRCode();
              }).catch((playError) => {
                console.error('Video play failed:', playError);
                setError('Failed to start video playback. Please try again or refresh the page.');
              });
            }
          }, 100);
        }
      }
    } catch (err) {
      console.error('Camera access error:', err);
      let errorMessage = 'Unable to access camera. ';
      
      if (err instanceof Error) {
        if (err.name === 'NotAllowedError') {
          errorMessage += 'Please allow camera permissions and try again.';
        } else if (err.name === 'NotFoundError') {
          errorMessage += 'No camera found on this device.';
        } else if (err.name === 'NotSupportedError') {
          errorMessage += 'Camera not supported in this browser.';
        } else {
          errorMessage += 'Please check permissions and try again.';
        }
      } else {
        errorMessage += 'Please check permissions and try again.';
      }
      
      setError(errorMessage);
      setScanningStatus('Camera access failed');
    }
  };

  const stopScanning = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    setIsScanning(false);
    setScanningStatus('Scanning stopped');
  };

  const scanForQRCode = () => {
    if (!isScanning || !videoRef.current || !canvasRef.current || !jsQR) {
      return;
    }

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const overlayCanvas = overlayCanvasRef.current;
    const ctx = canvas.getContext('2d');
    const overlayCtx = overlayCanvas?.getContext('2d');

    if (!ctx || video.videoWidth === 0 || video.videoHeight === 0) {
      animationFrameRef.current = requestAnimationFrame(scanForQRCode);
      return;
    }

    // Set canvas dimensions to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    if (overlayCanvas) {
      overlayCanvas.width = video.videoWidth;
      overlayCanvas.height = video.videoHeight;
    }

    // Draw video frame to canvas
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Get image data for QR scanning
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    
    try {
      // Scan for QR code using jsQR
      const qrCode = jsQR(imageData.data, imageData.width, imageData.height, {
        inversionAttempts: 'dontInvert'
      });

      // Clear overlay
      if (overlayCtx) {
        overlayCtx.clearRect(0, 0, overlayCanvas!.width, overlayCanvas!.height);
      }

      if (qrCode) {
        setScanningStatus('QR Code detected!');
        
        // Draw detection overlay
        if (overlayCtx) {
          overlayCtx.strokeStyle = '#00ff00';
          overlayCtx.lineWidth = 4;
          overlayCtx.beginPath();
          overlayCtx.moveTo(qrCode.location.topLeftCorner.x, qrCode.location.topLeftCorner.y);
          overlayCtx.lineTo(qrCode.location.topRightCorner.x, qrCode.location.topRightCorner.y);
          overlayCtx.lineTo(qrCode.location.bottomRightCorner.x, qrCode.location.bottomRightCorner.y);
          overlayCtx.lineTo(qrCode.location.bottomLeftCorner.x, qrCode.location.bottomLeftCorner.y);
          overlayCtx.closePath();
          overlayCtx.stroke();
        }

        // Add scanned data
        addScannedData(qrCode.data);
        
        // Brief pause after successful scan
        setTimeout(() => {
          setScanningStatus('Scanning for QR codes...');
        }, 1000);
      } else {
        setScanningStatus('Scanning for QR codes...');
      }
    } catch (err) {
      setScanningStatus('Scanning error - continuing...');
    }

    // Continue scanning
    if (isScanning) {
      animationFrameRef.current = requestAnimationFrame(scanForQRCode);
    }
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

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file');
      return;
    }

    if (!isLibraryLoaded || !jsQR) {
      setError('QR scanning library is not loaded yet. Please wait and try again.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        if (canvasRef.current) {
          const canvas = canvasRef.current;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);
            
            try {
              const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
              const qrCode = jsQR!(imageData.data, imageData.width, imageData.height);
              
              if (qrCode) {
                addScannedData(qrCode.data);
                setError('');
              } else {
                setError('No QR code found in the uploaded image');
              }
            } catch (err) {
              setError('Could not process the uploaded image');
            }
          }
        }
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
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
      {/* Library Status */}
      {!isLibraryLoaded && (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-muted-foreground">Loading QR scanning library...</div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Camera Scanner */}
      <Card>
        <CardHeader>
          <CardTitle>QR Code Scanner</CardTitle>
          <CardDescription>
            {hasCamera ? 'Use your camera to scan QR codes in real-time' : 'Camera not available - upload an image instead'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Button
              onClick={isScanning ? stopScanning : startScanning}
              className="flex items-center gap-2"
              disabled={!isLibraryLoaded}
            >
              {isScanning ? (
                <>
                  <IconCameraOff className="h-4 w-4" />
                  Stop Scanning
                </>
              ) : (
                <>
                  <IconCamera className="h-4 w-4" />
                  {hasCamera ? 'Start Camera' : 'Try Camera'}
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
          {isScanning && (
            <div className="text-sm text-muted-foreground">
              Status: {scanningStatus}
            </div>
          )}

          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
              <div className="text-destructive text-sm font-medium mb-2">Camera Error</div>
              <div className="text-destructive text-sm">{error}</div>
              {error.includes('permissions') && (
                <div className="mt-2 text-xs text-muted-foreground">
                  <strong>Troubleshooting:</strong>
                  <ul className="list-disc list-inside mt-1 space-y-1">
                    <li>Click the camera icon in your browser's address bar</li>
                    <li>Select "Allow" for camera permissions</li>
                    <li>Refresh the page and try again</li>
                    <li>Make sure no other app is using your camera</li>
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* Camera View */}
          {isScanning && (
            <div className="relative w-full max-w-lg mx-auto">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full aspect-video object-cover rounded-lg border bg-black"
                style={{ maxHeight: '400px' }}
              />
              <canvas
                ref={overlayCanvasRef}
                className="absolute top-0 left-0 w-full h-full pointer-events-none rounded-lg"
              />
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-24 h-24 sm:w-32 sm:h-32 border-2 border-white border-dashed rounded-lg opacity-70"></div>
              </div>
              <div className="absolute bottom-2 left-2 right-2 bg-black bg-opacity-75 text-white text-xs sm:text-sm p-2 rounded">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  {scanningStatus}
                </div>
              </div>
            </div>
          )}

          {/* Hidden canvas for processing */}
          <canvas ref={canvasRef} className="hidden" />
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
      <Card>
        <CardHeader>
          <CardTitle>QR Code Scanner Guide</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-semibold mb-2">How to use:</h4>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
              <li><strong>Camera scanning:</strong> Click "Start Camera" and point at a QR code</li>
              <li><strong>Image upload:</strong> Upload an image containing a QR code</li>
              <li><strong>Results:</strong> Scanned data appears below with type detection</li>
              <li><strong>Actions:</strong> Copy data or open URLs directly</li>
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
              <li>Real-time QR code detection using jsQR library</li>
              <li>Visual detection overlay showing QR code boundaries</li>
              <li>Automatic duplicate prevention (5-second cooldown)</li>
              <li>Support for various QR code formats and encodings</li>
              <li>Timestamp tracking for all scanned codes</li>
              <li>One-click copy to clipboard</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-2">Tips for better scanning:</h4>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
              <li>Ensure good lighting when using camera</li>
              <li>Hold the camera steady and at appropriate distance</li>
              <li>Make sure the QR code is within the dashed outline</li>
              <li>For images, ensure the QR code is clear and not blurry</li>
              <li>Try different angles if the QR code isn't detected immediately</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-2">Privacy & Security:</h4>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
              <li>All scanning is done locally in your browser using jsQR</li>
              <li>No data is sent to external servers</li>
              <li>Camera access requires your explicit permission</li>
              <li>Be cautious when opening URLs from unknown QR codes</li>
              <li>Scan history is stored locally and can be cleared anytime</li>
            </ul>
          </div>

          <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded text-sm">
            <strong>Production Ready:</strong> This scanner uses the jsQR library for accurate 
            QR code detection with real-time processing and visual feedback.
          </div>
        </CardContent>
      </Card>
    </div>
  );
}