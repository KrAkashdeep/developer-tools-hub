'use client';

import { useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import CopyButton from '@/components/common/CopyButton';
import { IconUpload, IconX } from '@tabler/icons-react';

interface ExtractedColor {
  hex: string;
  rgb: { r: number; g: number; b: number };
  count: number;
  percentage: number;
}

export default function PaletteExtractorTool() {
  const [image, setImage] = useState<string | null>(null);
  const [extractedColors, setExtractedColors] = useState<ExtractedColor[]>([]);
  const [colorCount, setColorCount] = useState([8]);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Convert RGB to hex
  const rgbToHex = (r: number, g: number, b: number): string => {
    return '#' + [r, g, b].map(x => {
      const hex = x.toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    }).join('');
  };

  // Calculate color distance
  const colorDistance = (c1: { r: number; g: number; b: number }, c2: { r: number; g: number; b: number }): number => {
    return Math.sqrt(
      Math.pow(c1.r - c2.r, 2) +
      Math.pow(c1.g - c2.g, 2) +
      Math.pow(c1.b - c2.b, 2)
    );
  };

  // K-means clustering for color extraction
  const extractColors = (imageData: ImageData, k: number): ExtractedColor[] => {
    const pixels: { r: number; g: number; b: number }[] = [];
    
    // Sample pixels (every 4th pixel for performance)
    for (let i = 0; i < imageData.data.length; i += 16) {
      const r = imageData.data[i];
      const g = imageData.data[i + 1];
      const b = imageData.data[i + 2];
      const a = imageData.data[i + 3];
      
      // Skip transparent pixels
      if (a > 128) {
        pixels.push({ r, g, b });
      }
    }

    if (pixels.length === 0) return [];

    // Initialize centroids randomly
    const centroids: { r: number; g: number; b: number }[] = [];
    for (let i = 0; i < k; i++) {
      const randomPixel = pixels[Math.floor(Math.random() * pixels.length)];
      centroids.push({ ...randomPixel });
    }

    // K-means iterations
    for (let iteration = 0; iteration < 20; iteration++) {
      const clusters: { r: number; g: number; b: number }[][] = Array(k).fill(null).map(() => []);
      
      // Assign pixels to nearest centroid
      pixels.forEach(pixel => {
        let minDistance = Infinity;
        let closestCentroid = 0;
        
        centroids.forEach((centroid, index) => {
          const distance = colorDistance(pixel, centroid);
          if (distance < minDistance) {
            minDistance = distance;
            closestCentroid = index;
          }
        });
        
        clusters[closestCentroid].push(pixel);
      });

      // Update centroids
      let changed = false;
      clusters.forEach((cluster, index) => {
        if (cluster.length > 0) {
          const newCentroid = {
            r: Math.round(cluster.reduce((sum, p) => sum + p.r, 0) / cluster.length),
            g: Math.round(cluster.reduce((sum, p) => sum + p.g, 0) / cluster.length),
            b: Math.round(cluster.reduce((sum, p) => sum + p.b, 0) / cluster.length)
          };
          
          if (colorDistance(centroids[index], newCentroid) > 1) {
            centroids[index] = newCentroid;
            changed = true;
          }
        }
      });

      if (!changed) break;
    }

    // Create result with counts
    const result: ExtractedColor[] = centroids
      .map((centroid, index) => {
        const cluster = pixels.filter(pixel => {
          let minDistance = Infinity;
          let closestCentroid = 0;
          
          centroids.forEach((c, i) => {
            const distance = colorDistance(pixel, c);
            if (distance < minDistance) {
              minDistance = distance;
              closestCentroid = i;
            }
          });
          
          return closestCentroid === index;
        });

        return {
          hex: rgbToHex(centroid.r, centroid.g, centroid.b),
          rgb: centroid,
          count: cluster.length,
          percentage: Math.round((cluster.length / pixels.length) * 100)
        };
      })
      .filter(color => color.count > 0)
      .sort((a, b) => b.count - a.count);

    return result;
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const imageUrl = e.target?.result as string;
      setImage(imageUrl);
      processImage(imageUrl);
    };
    reader.readAsDataURL(file);
  };

  const processImage = (imageUrl: string) => {
    setIsProcessing(true);
    
    const img = new Image();
    img.onload = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Resize image for processing (max 200x200 for performance)
      const maxSize = 200;
      const scale = Math.min(maxSize / img.width, maxSize / img.height);
      const width = Math.floor(img.width * scale);
      const height = Math.floor(img.height * scale);

      canvas.width = width;
      canvas.height = height;
      
      ctx.drawImage(img, 0, 0, width, height);
      const imageData = ctx.getImageData(0, 0, width, height);
      
      const colors = extractColors(imageData, colorCount[0]);
      setExtractedColors(colors);
      setIsProcessing(false);
    };
    
    img.src = imageUrl;
  };

  const removeImage = () => {
    setImage(null);
    setExtractedColors([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleColorCountChange = (value: number[]) => {
    setColorCount(value);
    if (image) {
      processImage(image);
    }
  };

  // Get relative luminance for contrast calculation
  const getLuminance = (rgb: { r: number; g: number; b: number }): number => {
    const [r, g, b] = [rgb.r, rgb.g, rgb.b].map(c => {
      c = c / 255;
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  };

  // Determine if text should be light or dark based on background
  const getTextColor = (rgb: { r: number; g: number; b: number }): string => {
    const luminance = getLuminance(rgb);
    return luminance > 0.5 ? '#000000' : '#ffffff';
  };

  return (
    <div className="space-y-6">
      {/* Image Upload */}
      <Card>
        <CardHeader>
          <CardTitle>Upload Image</CardTitle>
          <CardDescription>Upload an image to extract its color palette</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {!image ? (
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
                Supports JPG, PNG, GIF, and other image formats
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="relative inline-block">
                <img
                  src={image}
                  alt="Uploaded"
                  className="max-w-full max-h-64 rounded-lg border"
                />
                <Button
                  onClick={removeImage}
                  size="sm"
                  variant="destructive"
                  className="absolute top-2 right-2"
                >
                  <IconX className="h-4 w-4" />
                </Button>
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label>Number of Colors to Extract</Label>
                  <span className="text-sm font-mono">{colorCount[0]}</span>
                </div>
                <Slider
                  value={colorCount}
                  onValueChange={handleColorCountChange}
                  min={3}
                  max={16}
                  step={1}
                  className="w-full"
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Processing Canvas (hidden) */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Extracted Colors */}
      {extractedColors.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Extracted Color Palette</CardTitle>
            <CardDescription>
              {isProcessing ? 'Processing...' : `${extractedColors.length} colors extracted, sorted by frequency`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {extractedColors.map((color, index) => {
                const textColor = getTextColor(color.rgb);
                
                return (
                  <div key={index} className="flex items-center gap-4">
                    <div className="flex-shrink-0 w-12 text-sm text-muted-foreground">
                      #{index + 1}
                    </div>
                    <div
                      className="flex-1 p-4 rounded-lg border-2 border-border"
                      style={{ backgroundColor: color.hex, color: textColor }}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-semibold">{color.hex.toUpperCase()}</div>
                          <div className="text-sm opacity-90">
                            RGB({color.rgb.r}, {color.rgb.g}, {color.rgb.b})
                          </div>
                          <div className="text-xs opacity-75">
                            {color.percentage}% of image
                          </div>
                        </div>
                        <CopyButton text={color.hex.toUpperCase()} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Color Palette Grid */}
      {extractedColors.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Palette Grid</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-4 md:grid-cols-8 gap-2">
              {extractedColors.map((color, index) => (
                <div key={index} className="aspect-square relative group">
                  <div
                    className="w-full h-full rounded border-2 border-border cursor-pointer hover:scale-105 transition-transform"
                    style={{ backgroundColor: color.hex }}
                    onClick={() => navigator.clipboard.writeText(color.hex.toUpperCase())}
                  />
                  <div className="absolute inset-x-0 -bottom-6 text-xs text-center font-mono opacity-0 group-hover:opacity-100 transition-opacity">
                    {color.hex.toUpperCase()}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* CSS Export */}
      {extractedColors.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>CSS Variables</CardTitle>
              <CopyButton text={extractedColors.map((color, index) => `  --palette-${index + 1}: ${color.hex.toUpperCase()};`).join('\n')} />
            </div>
          </CardHeader>
          <CardContent>
            <pre className="bg-muted p-4 rounded font-mono text-sm overflow-x-auto">
{`:root {
${extractedColors.map((color, index) => `  --palette-${index + 1}: ${color.hex.toUpperCase()};`).join('\n')}
}`}
            </pre>
          </CardContent>
        </Card>
      )}

      {/* Documentation */}
      <Card>
        <CardHeader>
          <CardTitle>About Palette Extractor</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-semibold mb-2">How it Works:</h4>
            <p className="text-sm text-muted-foreground">
              Uses K-means clustering algorithm to analyze image pixels and group similar colors together. 
              The most dominant colors are extracted and sorted by frequency.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-2">Features:</h4>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
              <li>Extract 3-16 dominant colors from any image</li>
              <li>Colors sorted by frequency in the image</li>
              <li>Percentage breakdown of color usage</li>
              <li>Ready-to-use CSS variables</li>
              <li>Visual palette grid for quick overview</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-2">Use Cases:</h4>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
              <li>Creating color schemes from photographs</li>
              <li>Brand color extraction from logos</li>
              <li>Design inspiration from artwork</li>
              <li>Website color theme generation</li>
              <li>Color matching for design projects</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-2">Tips:</h4>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
              <li>Use high-quality images for better color extraction</li>
              <li>Images with clear color separation work best</li>
              <li>Adjust the number of colors based on image complexity</li>
              <li>Consider color accessibility when using extracted palettes</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}