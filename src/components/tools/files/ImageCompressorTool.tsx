'use client';

import { useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { IconUpload, IconDownload, IconX } from '@tabler/icons-react';
import CollapsibleGuide from '@/components/common/CollapsibleGuide';

interface ImageInfo {
  name: string;
  size: number;
  width: number;
  height: number;
  type: string;
}

export default function ImageCompressorTool() {
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [compressedImage, setCompressedImage] = useState<string | null>(null);
  const [originalInfo, setOriginalInfo] = useState<ImageInfo | null>(null);
  const [compressedInfo, setCompressedInfo] = useState<ImageInfo | null>(null);
  const [quality, setQuality] = useState([80]);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const imageUrl = e.target?.result as string;
      setOriginalImage(imageUrl);
      
      // Get image info
      const img = new Image();
      img.onload = () => {
        setOriginalInfo({
          name: file.name,
          size: file.size,
          width: img.width,
          height: img.height,
          type: file.type
        });
        
        // Auto-compress with current quality
        compressImage(img, file.name, file.type);
      };
      img.src = imageUrl;
    };
    reader.readAsDataURL(file);
  };

  const compressImage = (img: HTMLImageElement, filename: string, mimeType: string) => {
    setIsProcessing(true);
    
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas dimensions to match image
    canvas.width = img.width;
    canvas.height = img.height;

    // Draw image on canvas
    ctx.drawImage(img, 0, 0);

    // Convert to compressed blob
    canvas.toBlob(
      (blob) => {
        if (blob) {
          const compressedUrl = URL.createObjectURL(blob);
          setCompressedImage(compressedUrl);
          
          setCompressedInfo({
            name: filename,
            size: blob.size,
            width: img.width,
            height: img.height,
            type: mimeType
          });
        }
        setIsProcessing(false);
      },
      mimeType,
      quality[0] / 100
    );
  };

  const handleQualityChange = (newQuality: number[]) => {
    setQuality(newQuality);
    
    if (originalImage && originalInfo) {
      const img = new Image();
      img.onload = () => {
        compressImage(img, originalInfo.name, originalInfo.type);
      };
      img.src = originalImage;
    }
  };

  const downloadCompressed = () => {
    if (!compressedImage || !compressedInfo) return;

    const link = document.createElement('a');
    link.href = compressedImage;
    link.download = `compressed_${compressedInfo.name}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const removeImage = () => {
    setOriginalImage(null);
    setCompressedImage(null);
    setOriginalInfo(null);
    setCompressedInfo(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getCompressionRatio = (): number => {
    if (!originalInfo || !compressedInfo) return 0;
    return Math.round(((originalInfo.size - compressedInfo.size) / originalInfo.size) * 100);
  };

  return (
    <div className="space-y-6">
      {/* Upload Section */}
      <Card>
        <CardHeader>
          <CardTitle>Upload Image</CardTitle>
          <CardDescription>Select an image to compress (JPEG, PNG, WebP)</CardDescription>
        </CardHeader>
        <CardContent>
          {!originalImage ? (
            <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              <Button
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-2"
              >
                <IconUpload className="h-4 w-4" />
                Choose Image
              </Button>
              <p className="text-sm text-muted-foreground mt-2">
                Supports JPEG, PNG, WebP, and other image formats
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h4 className="font-semibold">Compression Settings</h4>
                <Button onClick={removeImage} size="sm" variant="destructive">
                  <IconX className="h-4 w-4" />
                </Button>
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label>Quality</Label>
                  <span className="text-sm font-mono">{quality[0]}%</span>
                </div>
                <Slider
                  value={quality}
                  onValueChange={handleQualityChange}
                  min={10}
                  max={100}
                  step={5}
                  className="w-full"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Lower quality = smaller file size
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Processing Canvas (hidden) */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Results */}
      {originalInfo && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Original Image */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Original Image</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="aspect-video bg-muted rounded-lg overflow-hidden flex items-center justify-center">
                <img
                  src={originalImage!}
                  alt="Original"
                  className="max-w-full max-h-full object-contain"
                />
              </div>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Size:</span>
                  <Badge variant="outline">{formatFileSize(originalInfo.size)}</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Dimensions:</span>
                  <Badge variant="outline">{originalInfo.width} × {originalInfo.height}</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Type:</span>
                  <Badge variant="outline">{originalInfo.type}</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Compressed Image */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Compressed Image</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {isProcessing ? (
                <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                  <p className="text-muted-foreground">Processing...</p>
                </div>
              ) : compressedImage && compressedInfo ? (
                <>
                  <div className="aspect-video bg-muted rounded-lg overflow-hidden flex items-center justify-center">
                    <img
                      src={compressedImage}
                      alt="Compressed"
                      className="max-w-full max-h-full object-contain"
                    />
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Size:</span>
                      <Badge variant="outline">{formatFileSize(compressedInfo.size)}</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Dimensions:</span>
                      <Badge variant="outline">{compressedInfo.width} × {compressedInfo.height}</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Compression:</span>
                      <Badge variant="secondary">{getCompressionRatio()}% smaller</Badge>
                    </div>
                  </div>
                  
                  <Button onClick={downloadCompressed} className="w-full">
                    <IconDownload className="h-4 w-4 mr-2" />
                    Download Compressed
                  </Button>
                </>
              ) : null}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Documentation */}
      <CollapsibleGuide title="Image Compressor Guide">
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold mb-2">How it works:</h4>
            <p className="text-sm text-muted-foreground">
              Uses HTML5 Canvas to re-encode images with adjustable quality settings. 
              Lower quality settings result in smaller file sizes but may reduce image clarity.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-2">Features:</h4>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
              <li>Adjustable compression quality (10-100%)</li>
              <li>Real-time compression preview</li>
              <li>File size comparison and compression ratio</li>
              <li>Preserves image dimensions</li>
              <li>Supports JPEG, PNG, WebP formats</li>
              <li>Client-side processing (no upload to server)</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-2">Quality guidelines:</h4>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
              <li><strong>90-100%:</strong> Highest quality, minimal compression</li>
              <li><strong>70-90%:</strong> Good quality, moderate compression</li>
              <li><strong>50-70%:</strong> Acceptable quality, significant compression</li>
              <li><strong>10-50%:</strong> Lower quality, maximum compression</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-2">Use cases:</h4>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
              <li>Reduce file sizes for web uploads</li>
              <li>Optimize images for email attachments</li>
              <li>Prepare images for social media</li>
              <li>Save storage space</li>
              <li>Improve website loading times</li>
            </ul>
          </div>
        </div>
      </CollapsibleGuide>
    </div>
  );
}