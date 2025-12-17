'use client';

import { useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { IconUpload, IconDownload, IconX, IconLink } from '@tabler/icons-react';
import CollapsibleGuide from '@/components/common/CollapsibleGuide';

interface ImageInfo {
  name: string;
  size: number;
  width: number;
  height: number;
  type: string;
}

export default function ImageResizerTool() {
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [resizedImage, setResizedImage] = useState<string | null>(null);
  const [originalInfo, setOriginalInfo] = useState<ImageInfo | null>(null);
  const [resizedInfo, setResizedInfo] = useState<ImageInfo | null>(null);
  const [targetWidth, setTargetWidth] = useState('');
  const [targetHeight, setTargetHeight] = useState('');
  const [maintainAspectRatio, setMaintainAspectRatio] = useState(true);
  const [resizeMode, setResizeMode] = useState<'stretch' | 'fit' | 'fill'>('fit');
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
      
      const img = new Image();
      img.onload = () => {
        const info = {
          name: file.name,
          size: file.size,
          width: img.width,
          height: img.height,
          type: file.type
        };
        setOriginalInfo(info);
        
        // Set default target dimensions
        setTargetWidth(img.width.toString());
        setTargetHeight(img.height.toString());
      };
      img.src = imageUrl;
    };
    reader.readAsDataURL(file);
  };

  const calculateAspectRatio = (width: number, height: number) => {
    const gcd = (a: number, b: number): number => b === 0 ? a : gcd(b, a % b);
    const divisor = gcd(width, height);
    return `${width / divisor}:${height / divisor}`;
  };

  const handleWidthChange = (value: string) => {
    setTargetWidth(value);
    
    if (maintainAspectRatio && originalInfo && value) {
      const newWidth = parseInt(value);
      if (!isNaN(newWidth)) {
        const aspectRatio = originalInfo.width / originalInfo.height;
        const newHeight = Math.round(newWidth / aspectRatio);
        setTargetHeight(newHeight.toString());
      }
    }
  };

  const handleHeightChange = (value: string) => {
    setTargetHeight(value);
    
    if (maintainAspectRatio && originalInfo && value) {
      const newHeight = parseInt(value);
      if (!isNaN(newHeight)) {
        const aspectRatio = originalInfo.width / originalInfo.height;
        const newWidth = Math.round(newHeight * aspectRatio);
        setTargetWidth(newWidth.toString());
      }
    }
  };

  const resizeImage = () => {
    if (!originalImage || !originalInfo) return;

    const width = parseInt(targetWidth);
    const height = parseInt(targetHeight);

    if (isNaN(width) || isNaN(height) || width <= 0 || height <= 0) {
      alert('Please enter valid dimensions');
      return;
    }

    setIsProcessing(true);

    const img = new Image();
    img.onload = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      let drawWidth = width;
      let drawHeight = height;
      let offsetX = 0;
      let offsetY = 0;

      if (resizeMode === 'fit') {
        // Fit image within dimensions while maintaining aspect ratio
        const scale = Math.min(width / img.width, height / img.height);
        drawWidth = img.width * scale;
        drawHeight = img.height * scale;
        offsetX = (width - drawWidth) / 2;
        offsetY = (height - drawHeight) / 2;
      } else if (resizeMode === 'fill') {
        // Fill dimensions while maintaining aspect ratio (may crop)
        const scale = Math.max(width / img.width, height / img.height);
        drawWidth = img.width * scale;
        drawHeight = img.height * scale;
        offsetX = (width - drawWidth) / 2;
        offsetY = (height - drawHeight) / 2;
      }
      // For 'stretch' mode, use the target dimensions directly

      canvas.width = width;
      canvas.height = height;

      // Clear canvas with white background
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, width, height);

      // Draw resized image
      ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);

      canvas.toBlob(
        (blob) => {
          if (blob) {
            const resizedUrl = URL.createObjectURL(blob);
            setResizedImage(resizedUrl);
            
            setResizedInfo({
              name: originalInfo.name,
              size: blob.size,
              width: width,
              height: height,
              type: originalInfo.type
            });
          }
          setIsProcessing(false);
        },
        originalInfo.type,
        0.9
      );
    };
    img.src = originalImage;
  };

  const downloadResized = () => {
    if (!resizedImage || !resizedInfo) return;

    const link = document.createElement('a');
    link.href = resizedImage;
    const nameWithoutExt = resizedInfo.name.replace(/\.[^/.]+$/, '');
    const ext = resizedInfo.name.split('.').pop();
    link.download = `${nameWithoutExt}_${resizedInfo.width}x${resizedInfo.height}.${ext}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const removeImage = () => {
    setOriginalImage(null);
    setResizedImage(null);
    setOriginalInfo(null);
    setResizedInfo(null);
    setTargetWidth('');
    setTargetHeight('');
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

  const commonSizes = [
    { name: 'Instagram Square', width: 1080, height: 1080 },
    { name: 'Instagram Portrait', width: 1080, height: 1350 },
    { name: 'Facebook Cover', width: 1200, height: 630 },
    { name: 'Twitter Header', width: 1500, height: 500 },
    { name: 'YouTube Thumbnail', width: 1280, height: 720 },
    { name: 'HD (720p)', width: 1280, height: 720 },
    { name: 'Full HD (1080p)', width: 1920, height: 1080 },
    { name: 'Profile Picture', width: 400, height: 400 },
  ];

  return (
    <div className="space-y-6">
      {/* Upload Section */}
      <Card>
        <CardHeader>
          <CardTitle>Upload Image</CardTitle>
          <CardDescription>Select an image to resize</CardDescription>
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
            <div className="flex justify-between items-center">
              <div>
                <p className="font-semibold">{originalInfo?.name}</p>
                <p className="text-sm text-muted-foreground">
                  {originalInfo?.width} × {originalInfo?.height} • {formatFileSize(originalInfo?.size || 0)}
                </p>
              </div>
              <Button onClick={removeImage} size="sm" variant="destructive">
                <IconX className="h-4 w-4" />
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Resize Settings */}
      {originalInfo && (
        <Card>
          <CardHeader>
            <CardTitle>Resize Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="width">Width (px)</Label>
                <Input
                  id="width"
                  type="number"
                  value={targetWidth}
                  onChange={(e) => handleWidthChange(e.target.value)}
                  min="1"
                  className="mt-2"
                />
              </div>
              <div>
                <Label htmlFor="height">Height (px)</Label>
                <Input
                  id="height"
                  type="number"
                  value={targetHeight}
                  onChange={(e) => handleHeightChange(e.target.value)}
                  min="1"
                  className="mt-2"
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="aspectRatio"
                checked={maintainAspectRatio}
                onCheckedChange={(checked) => setMaintainAspectRatio(checked as boolean)}
              />
              <Label htmlFor="aspectRatio" className="flex items-center gap-2">
                <IconLink className="h-4 w-4" />
                Maintain aspect ratio
              </Label>
              {originalInfo && (
                <Badge variant="outline">
                  {calculateAspectRatio(originalInfo.width, originalInfo.height)}
                </Badge>
              )}
            </div>

            <div>
              <Label>Resize Mode</Label>
              <div className="flex gap-2 mt-2">
                <Button
                  variant={resizeMode === 'fit' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setResizeMode('fit')}
                >
                  Fit
                </Button>
                <Button
                  variant={resizeMode === 'fill' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setResizeMode('fill')}
                >
                  Fill
                </Button>
                <Button
                  variant={resizeMode === 'stretch' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setResizeMode('stretch')}
                >
                  Stretch
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {resizeMode === 'fit' && 'Fit image within dimensions (may add padding)'}
                {resizeMode === 'fill' && 'Fill dimensions completely (may crop image)'}
                {resizeMode === 'stretch' && 'Stretch to exact dimensions (may distort)'}
              </p>
            </div>

            <Button onClick={resizeImage} className="w-full" disabled={isProcessing}>
              {isProcessing ? 'Processing...' : 'Resize Image'}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Common Sizes */}
      {originalInfo && (
        <Card>
          <CardHeader>
            <CardTitle>Common Sizes</CardTitle>
            <CardDescription>Click to use preset dimensions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {commonSizes.map((size, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setTargetWidth(size.width.toString());
                    setTargetHeight(size.height.toString());
                  }}
                  className="text-xs"
                >
                  <div className="text-center">
                    <div className="font-semibold">{size.name}</div>
                    <div className="text-muted-foreground">{size.width}×{size.height}</div>
                  </div>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Processing Canvas (hidden) */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Results */}
      {resizedImage && resizedInfo && (
        <Card>
          <CardHeader>
            <CardTitle>Resized Image</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="aspect-video bg-muted rounded-lg overflow-hidden flex items-center justify-center">
              <img
                src={resizedImage}
                alt="Resized"
                className="max-w-full max-h-full object-contain"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex justify-between">
                <span>Size:</span>
                <Badge variant="outline">{formatFileSize(resizedInfo.size)}</Badge>
              </div>
              <div className="flex justify-between">
                <span>Dimensions:</span>
                <Badge variant="outline">{resizedInfo.width} × {resizedInfo.height}</Badge>
              </div>
            </div>
            
            <Button onClick={downloadResized} className="w-full">
              <IconDownload className="h-4 w-4 mr-2" />
              Download Resized Image
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Documentation */}
      <CollapsibleGuide title="Image Resizer Guide">
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold mb-2">Resize modes:</h4>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
              <li><strong>Fit:</strong> Scales image to fit within dimensions while maintaining aspect ratio</li>
              <li><strong>Fill:</strong> Scales image to fill dimensions completely, may crop parts of the image</li>
              <li><strong>Stretch:</strong> Stretches image to exact dimensions, may distort the image</li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-2">Features:</h4>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
              <li>Maintain aspect ratio option</li>
              <li>Common preset sizes for social media</li>
              <li>Multiple resize modes</li>
              <li>Real-time preview</li>
              <li>Client-side processing (no upload to server)</li>
              <li>Preserves image quality</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-2">Use cases:</h4>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
              <li>Prepare images for social media platforms</li>
              <li>Create thumbnails</li>
              <li>Resize for web optimization</li>
              <li>Standardize image dimensions</li>
              <li>Create profile pictures</li>
            </ul>
          </div>
        </div>
      </CollapsibleGuide>
    </div>
  );
}