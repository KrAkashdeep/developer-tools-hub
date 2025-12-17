'use client';

import { useState, useEffect } from 'react';
import ToolLayout from '@/components/common/ToolLayout';
import InputBox from '@/components/common/InputBox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { IconDownload } from '@tabler/icons-react';
import CollapsibleGuide from '@/components/common/CollapsibleGuide';

export default function QrGeneratorTool() {
  const [input, setInput] = useState('');
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [size, setSize] = useState(200);
  const [errorCorrection, setErrorCorrection] = useState('M');

  // Generate QR code using a simple canvas-based approach
  const generateQRCode = (text: string, size: number) => {
    if (!text.trim()) {
      setQrCodeUrl('');
      return;
    }

    // For a real implementation, you'd use a QR code library like qrcode
    // For now, we'll use a public API as a demonstration
    const apiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(text)}&ecc=${errorCorrection}`;
    setQrCodeUrl(apiUrl);
  };

  useEffect(() => {
    generateQRCode(input, size);
  }, [input, size, errorCorrection]);

  const handleExample = () => {
    const example = 'https://multidevtools.com - Your favorite developer tools!';
    setInput(example);
  };

  const downloadQRCode = async () => {
    if (!qrCodeUrl) return;
    
    try {
      // Convert data URL to blob for better browser compatibility
      const response = await fetch(qrCodeUrl);
      const blob = await response.blob();
      
      // Create object URL from blob
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `qrcode-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Clean up object URL
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download failed:', error);
      // Fallback to original method
      const link = document.createElement('a');
      link.href = qrCodeUrl;
      link.download = `qrcode-${Date.now()}.png`;
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="space-y-6">
      <ToolLayout>
        <div className="space-y-4">
          <InputBox
            title="Text or URL"
            value={input}
            onChange={setInput}
            placeholder="Enter text or URL to generate QR code..."
            type="textarea"
            rows={6}
            example="Load example URL"
            onExample={handleExample}
          />

          {/* Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">QR Code Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="size">Size: {size}x{size} pixels</Label>
                <input
                  id="size"
                  type="range"
                  min="100"
                  max="500"
                  step="50"
                  value={size}
                  onChange={(e) => setSize(Number(e.target.value))}
                  className="w-full mt-2"
                />
              </div>

              <div>
                <Label htmlFor="error-correction">Error Correction Level</Label>
                <select
                  id="error-correction"
                  value={errorCorrection}
                  onChange={(e) => setErrorCorrection(e.target.value)}
                  className="w-full mt-2 px-3 py-2 border rounded"
                >
                  <option value="L">Low (7%)</option>
                  <option value="M">Medium (15%)</option>
                  <option value="Q">Quartile (25%)</option>
                  <option value="H">High (30%)</option>
                </select>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Generated QR Code</h3>
            {qrCodeUrl && (
              <Button onClick={downloadQRCode} size="sm" className="flex items-center gap-2">
                <IconDownload className="h-4 w-4" />
                Download
              </Button>
            )}
          </div>

          <Card>
            <CardContent className="pt-6">
              <div className="flex justify-center items-center min-h-[300px]">
                {qrCodeUrl ? (
                  <img
                    src={qrCodeUrl}
                    alt="Generated QR Code"
                    className="border rounded"
                    style={{ width: size, height: size }}
                  />
                ) : (
                  <div className="text-center text-muted-foreground">
                    <div className="w-32 h-32 border-2 border-dashed border-muted-foreground/30 rounded-lg flex items-center justify-center mx-auto mb-4">
                      QR
                    </div>
                    <p>Enter text above to generate QR code</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {input && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">QR Code Info</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Content Length:</span>
                  <span>{input.length} characters</span>
                </div>
                <div className="flex justify-between">
                  <span>Size:</span>
                  <span>{size}×{size} pixels</span>
                </div>
                <div className="flex justify-between">
                  <span>Error Correction:</span>
                  <span>{errorCorrection} Level</span>
                </div>
                <div className="flex justify-between">
                  <span>Format:</span>
                  <span>PNG Image</span>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </ToolLayout>

      {/* Documentation */}
      <CollapsibleGuide title="QR Code Generator Guide">
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold mb-2">What is a QR Code?</h4>
            <CardDescription>
              QR (Quick Response) codes are two-dimensional barcodes that can store various types of data 
              including text, URLs, contact information, and more. They can be scanned by smartphones and QR code readers.
            </CardDescription>
          </div>
          
          <div>
            <h4 className="font-semibold mb-2">Error Correction Levels:</h4>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
              <li><strong>Low (L):</strong> ~7% damage recovery - smaller QR codes</li>
              <li><strong>Medium (M):</strong> ~15% damage recovery - balanced size/reliability</li>
              <li><strong>Quartile (Q):</strong> ~25% damage recovery - good for printed materials</li>
              <li><strong>High (H):</strong> ~30% damage recovery - maximum reliability</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-2">Common use cases:</h4>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
              <li>Website URLs and landing pages</li>
              <li>Contact information (vCard format)</li>
              <li>WiFi network credentials</li>
              <li>Product information and pricing</li>
              <li>Event details and tickets</li>
              <li>Social media profiles</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-2">Tips for better QR codes:</h4>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
              <li>Keep text short for smaller, cleaner codes</li>
              <li>Use higher error correction for printed materials</li>
              <li>Test scanning from different distances and angles</li>
              <li>Ensure good contrast when printing</li>
              <li>Leave white space around the QR code</li>
            </ul>
          </div>
        </div>
      </CollapsibleGuide>
    </div>
  );
}