'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import CopyButton from '@/components/common/CopyButton';

export default function TintGeneratorTool() {
  const [baseColor, setBaseColor] = useState('#3b82f6');
  const [tintCount, setTintCount] = useState([9]);
  const [tints, setTints] = useState<string[]>([]);

  // Convert hex to RGB
  const hexToRgb = (hex: string): { r: number; g: number; b: number } => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : { r: 0, g: 0, b: 0 };
  };

  // Convert RGB to hex
  const rgbToHex = (r: number, g: number, b: number): string => {
    return '#' + [r, g, b].map(x => {
      const hex = Math.round(Math.max(0, Math.min(255, x))).toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    }).join('');
  };

  // Convert RGB to HSL
  const rgbToHsl = (r: number, g: number, b: number): { h: number; s: number; l: number } => {
    r /= 255;
    g /= 255;
    b /= 255;
    
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0, s = 0, l = (max + min) / 2;

    if (max === min) {
      h = s = 0;
    } else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }

    return { h: h * 360, s: s * 100, l: l * 100 };
  };

  // Convert HSL to RGB
  const hslToRgb = (h: number, s: number, l: number): { r: number; g: number; b: number } => {
    h /= 360;
    s /= 100;
    l /= 100;

    const hue2rgb = (p: number, q: number, t: number): number => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1/6) return p + (q - p) * 6 * t;
      if (t < 1/2) return q;
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    };

    let r, g, b;

    if (s === 0) {
      r = g = b = l;
    } else {
      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;
      r = hue2rgb(p, q, h + 1/3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1/3);
    }

    return {
      r: Math.round(r * 255),
      g: Math.round(g * 255),
      b: Math.round(b * 255)
    };
  };

  // Generate tints by adjusting saturation and lightness
  const generateTints = (color: string, count: number): string[] => {
    const rgb = hexToRgb(color);
    const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
    const tints: string[] = [];
    
    // Add the original color in the middle
    const middleIndex = Math.floor(count / 2);
    
    for (let i = 0; i < count; i++) {
      if (i === middleIndex) {
        // Original color
        tints.push(color);
      } else if (i < middleIndex) {
        // Lighter tints (increase lightness, decrease saturation slightly)
        const factor = (middleIndex - i) / middleIndex;
        const newLightness = Math.min(95, hsl.l + (95 - hsl.l) * factor);
        const newSaturation = Math.max(10, hsl.s - (hsl.s * factor * 0.3));
        
        const newRgb = hslToRgb(hsl.h, newSaturation, newLightness);
        tints.push(rgbToHex(newRgb.r, newRgb.g, newRgb.b));
      } else {
        // Darker tints (decrease lightness, increase saturation slightly)
        const factor = (i - middleIndex) / (count - middleIndex - 1);
        const newLightness = Math.max(5, hsl.l - (hsl.l * factor * 0.8));
        const newSaturation = Math.min(100, hsl.s + (100 - hsl.s) * factor * 0.2);
        
        const newRgb = hslToRgb(hsl.h, newSaturation, newLightness);
        tints.push(rgbToHex(newRgb.r, newRgb.g, newRgb.b));
      }
    }
    
    return tints;
  };

  // Update tints when base color or count changes
  useEffect(() => {
    const newTints = generateTints(baseColor, tintCount[0]);
    setTints(newTints);
  }, [baseColor, tintCount]);

  // Get relative luminance for contrast calculation
  const getLuminance = (hex: string): number => {
    const rgb = hexToRgb(hex);
    const [r, g, b] = [rgb.r, rgb.g, rgb.b].map(c => {
      c = c / 255;
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  };

  // Determine if text should be light or dark based on background
  const getTextColor = (backgroundColor: string): string => {
    const luminance = getLuminance(backgroundColor);
    return luminance > 0.5 ? '#000000' : '#ffffff';
  };

  const commonBaseColors = [
    { name: 'Blue', color: '#3b82f6' },
    { name: 'Red', color: '#ef4444' },
    { name: 'Green', color: '#22c55e' },
    { name: 'Purple', color: '#a855f7' },
    { name: 'Orange', color: '#f97316' },
    { name: 'Pink', color: '#ec4899' },
    { name: 'Teal', color: '#14b8a6' },
    { name: 'Indigo', color: '#6366f1' },
  ];

  return (
    <div className="space-y-6">
      {/* Base Color Input */}
      <Card>
        <CardHeader>
          <CardTitle>Base Color</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <input
              type="color"
              value={baseColor}
              onChange={(e) => setBaseColor(e.target.value)}
              className="w-16 h-10 rounded border cursor-pointer"
            />
            <Input
              value={baseColor}
              onChange={(e) => setBaseColor(e.target.value)}
              placeholder="#000000"
              className="font-mono"
            />
          </div>
          
          <div>
            <div className="flex items-center justify-between mb-2">
              <Label>Number of Tints</Label>
              <span className="text-sm font-mono">{tintCount[0]}</span>
            </div>
            <Slider
              value={tintCount}
              onValueChange={setTintCount}
              min={3}
              max={15}
              step={2}
              className="w-full"
            />
          </div>
        </CardContent>
      </Card>

      {/* Generated Tints */}
      <Card>
        <CardHeader>
          <CardTitle>Generated Tints</CardTitle>
          <CardDescription>Harmonious variations using HSL adjustments</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {tints.map((tint, index) => {
              const textColor = getTextColor(tint);
              const isBaseColor = index === Math.floor(tints.length / 2);
              const rgb = hexToRgb(tint);
              const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
              
              return (
                <div key={index} className="flex items-center gap-4">
                  <div className="flex-shrink-0 w-16 text-sm text-muted-foreground">
                    {isBaseColor ? 'Base' : `Tint ${index + 1}`}
                  </div>
                  <div
                    className="flex-1 p-4 rounded-lg border-2 border-border"
                    style={{ backgroundColor: tint, color: textColor }}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-semibold">
                          {isBaseColor ? 'Base Color' : `Tint ${index + 1}`}
                        </div>
                        <div className="font-mono text-sm opacity-90">{tint.toUpperCase()}</div>
                        <div className="text-xs opacity-75">
                          HSL({Math.round(hsl.h)}, {Math.round(hsl.s)}%, {Math.round(hsl.l)}%)
                        </div>
                      </div>
                      <CopyButton text={tint.toUpperCase()} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Color Palette Grid */}
      <Card>
        <CardHeader>
          <CardTitle>Palette Grid</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 md:grid-cols-5 gap-2">
            {tints.map((tint, index) => (
              <div key={index} className="aspect-square relative group">
                <div
                  className="w-full h-full rounded border-2 border-border cursor-pointer hover:scale-105 transition-transform"
                  style={{ backgroundColor: tint }}
                  onClick={() => navigator.clipboard.writeText(tint.toUpperCase())}
                />
                <div className="absolute inset-x-0 -bottom-6 text-xs text-center font-mono opacity-0 group-hover:opacity-100 transition-opacity">
                  {tint.toUpperCase()}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* CSS Variables */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>CSS Variables</CardTitle>
            <CopyButton text={tints.map((tint, index) => `  --tint-${index + 1}: ${tint.toUpperCase()};`).join('\n')} />
          </div>
        </CardHeader>
        <CardContent>
          <pre className="bg-muted p-4 rounded font-mono text-sm overflow-x-auto">
{`:root {
${tints.map((tint, index) => `  --tint-${index + 1}: ${tint.toUpperCase()};`).join('\n')}
}`}
          </pre>
        </CardContent>
      </Card>

      {/* Common Base Colors */}
      <Card>
        <CardHeader>
          <CardTitle>Common Base Colors</CardTitle>
          <CardDescription>Click any color to generate its tints</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-3">
            {commonBaseColors.map((color, index) => (
              <div
                key={index}
                className="cursor-pointer hover:scale-105 transition-transform"
                onClick={() => setBaseColor(color.color)}
              >
                <div
                  className="w-full h-16 rounded border-2 border-border"
                  style={{ backgroundColor: color.color }}
                />
                <div className="text-center mt-1">
                  <div className="text-xs font-semibold">{color.name}</div>
                  <div className="text-xs font-mono text-muted-foreground">{color.color}</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Documentation */}
      <Card>
        <CardHeader>
          <CardTitle>About Tint Generator</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-semibold mb-2">What are Color Tints?</h4>
            <p className="text-sm text-muted-foreground">
              Tints are harmonious color variations created by adjusting the hue, saturation, and lightness (HSL) 
              of a base color. Unlike simple shades, tints maintain color harmony and visual appeal.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-2">How it Works:</h4>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
              <li>Converts base color to HSL color space</li>
              <li>Creates lighter variations by increasing lightness and slightly decreasing saturation</li>
              <li>Creates darker variations by decreasing lightness and slightly increasing saturation</li>
              <li>Maintains color harmony through intelligent HSL adjustments</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-2">Features:</h4>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
              <li>Generate 3-15 harmonious tint variations</li>
              <li>HSL-based color adjustments for better harmony</li>
              <li>Visual palette grid for quick overview</li>
              <li>Ready-to-use CSS variables</li>
              <li>HSL values displayed for each tint</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-2">Use Cases:</h4>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
              <li>Creating sophisticated color palettes</li>
              <li>Brand color system development</li>
              <li>UI component color variations</li>
              <li>Gradient color stops</li>
              <li>Harmonious color schemes</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-2">Difference from Shades:</h4>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
              <li>Tints use HSL adjustments for better color harmony</li>
              <li>Shades simply add/remove black and white</li>
              <li>Tints maintain color relationships and visual appeal</li>
              <li>Better for creating professional color palettes</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}