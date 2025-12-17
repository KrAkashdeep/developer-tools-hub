'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import CopyButton from '@/components/common/CopyButton';
import CollapsibleGuide from '@/components/common/CollapsibleGuide';

export default function HslHexConverterTool() {
  const [hex, setHex] = useState('#3b82f6');
  const [hsl, setHsl] = useState({ h: 217, s: 91, l: 60 });
  const [rgb, setRgb] = useState({ r: 59, g: 130, b: 246 });

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
      const hex = Math.round(x).toString(16);
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

    return {
      h: Math.round(h * 360),
      s: Math.round(s * 100),
      l: Math.round(l * 100)
    };
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

  // Update all values when hex changes
  const updateFromHex = (newHex: string) => {
    if (/^#[0-9A-F]{6}$/i.test(newHex)) {
      setHex(newHex);
      const newRgb = hexToRgb(newHex);
      setRgb(newRgb);
      setHsl(rgbToHsl(newRgb.r, newRgb.g, newRgb.b));
    }
  };

  // Update all values when HSL changes
  const updateFromHsl = (newHsl: { h: number; s: number; l: number }) => {
    setHsl(newHsl);
    const newRgb = hslToRgb(newHsl.h, newHsl.s, newHsl.l);
    setRgb(newRgb);
    setHex(rgbToHex(newRgb.r, newRgb.g, newRgb.b));
  };

  // Initialize with default color
  useEffect(() => {
    updateFromHex('#3b82f6');
  }, []);

  const hslString = `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`;
  const rgbString = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;

  const commonColors = [
    { name: 'Red', hex: '#ff0000' },
    { name: 'Green', hex: '#00ff00' },
    { name: 'Blue', hex: '#0000ff' },
    { name: 'Yellow', hex: '#ffff00' },
    { name: 'Cyan', hex: '#00ffff' },
    { name: 'Magenta', hex: '#ff00ff' },
    { name: 'Orange', hex: '#ff8000' },
    { name: 'Purple', hex: '#8000ff' },
  ];

  return (
    <div className="space-y-6">
      {/* Color Preview */}
      <Card>
        <CardHeader>
          <CardTitle>Color Preview</CardTitle>
        </CardHeader>
        <CardContent>
          <div
            className="w-full h-32 rounded-lg border-2 border-border"
            style={{ backgroundColor: hex }}
          />
        </CardContent>
      </Card>

      {/* HEX Input */}
      <Card>
        <CardHeader>
          <CardTitle>HEX Color</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <input
              type="color"
              value={hex}
              onChange={(e) => updateFromHex(e.target.value)}
              className="w-16 h-10 rounded border cursor-pointer"
            />
            <Input
              value={hex}
              onChange={(e) => updateFromHex(e.target.value)}
              placeholder="#000000"
              className="font-mono"
            />
            <CopyButton text={hex} />
          </div>
        </CardContent>
      </Card>

      {/* HSL Controls */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>HSL Color</CardTitle>
            <CopyButton text={hslString} />
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="font-mono text-sm p-3 bg-muted rounded">
            {hslString}
          </div>
          
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <Label>Hue</Label>
                <span className="text-sm font-mono">{hsl.h}°</span>
              </div>
              <Slider
                value={[hsl.h]}
                onValueChange={([value]) => updateFromHsl({ ...hsl, h: value })}
                max={360}
                step={1}
                className="w-full"
              />
            </div>
            
            <div>
              <div className="flex items-center justify-between mb-2">
                <Label>Saturation</Label>
                <span className="text-sm font-mono">{hsl.s}%</span>
              </div>
              <Slider
                value={[hsl.s]}
                onValueChange={([value]) => updateFromHsl({ ...hsl, s: value })}
                max={100}
                step={1}
                className="w-full"
              />
            </div>
            
            <div>
              <div className="flex items-center justify-between mb-2">
                <Label>Lightness</Label>
                <span className="text-sm font-mono">{hsl.l}%</span>
              </div>
              <Slider
                value={[hsl.l]}
                onValueChange={([value]) => updateFromHsl({ ...hsl, l: value })}
                max={100}
                step={1}
                className="w-full"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* RGB Display */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>RGB Color</CardTitle>
            <CopyButton text={rgbString} />
          </div>
        </CardHeader>
        <CardContent>
          <div className="font-mono text-sm p-3 bg-muted rounded">
            {rgbString}
          </div>
          <div className="grid grid-cols-3 gap-4 mt-4">
            <div className="text-center">
              <div className="text-sm text-muted-foreground">Red</div>
              <div className="font-mono font-semibold">{rgb.r}</div>
            </div>
            <div className="text-center">
              <div className="text-sm text-muted-foreground">Green</div>
              <div className="font-mono font-semibold">{rgb.g}</div>
            </div>
            <div className="text-center">
              <div className="text-sm text-muted-foreground">Blue</div>
              <div className="font-mono font-semibold">{rgb.b}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Common Colors */}
      <Card>
        <CardHeader>
          <CardTitle>Common Colors</CardTitle>
          <CardDescription>Click any color to convert it</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-3">
            {commonColors.map((color, index) => (
              <div
                key={index}
                className="cursor-pointer hover:scale-105 transition-transform"
                onClick={() => updateFromHex(color.hex)}
              >
                <div
                  className="w-full h-16 rounded border-2 border-border"
                  style={{ backgroundColor: color.hex }}
                />
                <div className="text-center mt-1">
                  <div className="text-xs font-semibold">{color.name}</div>
                  <div className="text-xs font-mono text-muted-foreground">{color.hex}</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Documentation */}
      <CollapsibleGuide title="HSL ↔ HEX Converter Guide">
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold mb-2">Color Formats:</h4>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
              <li><strong>HEX:</strong> Hexadecimal notation (#RRGGBB)</li>
              <li><strong>HSL:</strong> Hue (0-360°), Saturation (0-100%), Lightness (0-100%)</li>
              <li><strong>RGB:</strong> Red, Green, Blue values (0-255)</li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-2">HSL Advantages:</h4>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
              <li>More intuitive for color adjustments</li>
              <li>Easy to create color variations</li>
              <li>Better for programmatic color manipulation</li>
              <li>Natural way to think about color relationships</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-2">Use Cases:</h4>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
              <li>Converting between CSS color formats</li>
              <li>Creating color themes and palettes</li>
              <li>Fine-tuning colors with HSL sliders</li>
              <li>Design system color management</li>
            </ul>
          </div>
        </div>
      </CollapsibleGuide>
    </div>
  );
}