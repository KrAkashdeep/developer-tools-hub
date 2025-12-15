'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import CopyButton from '@/components/common/CopyButton';
import { Badge } from '@/components/ui/badge';

interface ColorValues {
  hex: string;
  rgb: { r: number; g: number; b: number };
  hsl: { h: number; s: number; l: number };
  hsv: { h: number; s: number; v: number };
  cmyk: { c: number; m: number; y: number; k: number };
}

export default function ColorPickerTool() {
  const [color, setColor] = useState('#3b82f6');
  const [colorValues, setColorValues] = useState<ColorValues>({
    hex: '#3b82f6',
    rgb: { r: 59, g: 130, b: 246 },
    hsl: { h: 217, s: 91, l: 60 },
    hsv: { h: 217, s: 76, v: 96 },
    cmyk: { c: 76, m: 47, y: 0, k: 4 }
  });

  // Convert hex to RGB
  const hexToRgb = (hex: string): { r: number; g: number; b: number } => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : { r: 0, g: 0, b: 0 };
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

  // Convert RGB to HSV
  const rgbToHsv = (r: number, g: number, b: number): { h: number; s: number; v: number } => {
    r /= 255;
    g /= 255;
    b /= 255;
    
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0, s = 0, v = max;

    const d = max - min;
    s = max === 0 ? 0 : d / max;

    if (max === min) {
      h = 0;
    } else {
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
      v: Math.round(v * 100)
    };
  };

  // Convert RGB to CMYK
  const rgbToCmyk = (r: number, g: number, b: number): { c: number; m: number; y: number; k: number } => {
    r /= 255;
    g /= 255;
    b /= 255;
    
    const k = 1 - Math.max(r, Math.max(g, b));
    const c = (1 - r - k) / (1 - k) || 0;
    const m = (1 - g - k) / (1 - k) || 0;
    const y = (1 - b - k) / (1 - k) || 0;

    return {
      c: Math.round(c * 100),
      m: Math.round(m * 100),
      y: Math.round(y * 100),
      k: Math.round(k * 100)
    };
  };

  // Update all color values when color changes
  useEffect(() => {
    const rgb = hexToRgb(color);
    const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
    const hsv = rgbToHsv(rgb.r, rgb.g, rgb.b);
    const cmyk = rgbToCmyk(rgb.r, rgb.g, rgb.b);

    setColorValues({
      hex: color.toUpperCase(),
      rgb,
      hsl,
      hsv,
      cmyk
    });
  }, [color]);

  // Generate color palette
  const generatePalette = () => {
    const rgb = colorValues.rgb;
    const palette = [];
    
    // Lighter shades
    for (let i = 1; i <= 4; i++) {
      const factor = i * 0.2;
      const r = Math.round(rgb.r + (255 - rgb.r) * factor);
      const g = Math.round(rgb.g + (255 - rgb.g) * factor);
      const b = Math.round(rgb.b + (255 - rgb.b) * factor);
      palette.push(`#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`);
    }
    
    // Original color
    palette.push(color);
    
    // Darker shades
    for (let i = 1; i <= 4; i++) {
      const factor = i * 0.2;
      const r = Math.round(rgb.r * (1 - factor));
      const g = Math.round(rgb.g * (1 - factor));
      const b = Math.round(rgb.b * (1 - factor));
      palette.push(`#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`);
    }
    
    return palette;
  };

  const palette = generatePalette();

  return (
    <div className="space-y-6">
      {/* Color Picker */}
      <Card>
        <CardHeader>
          <CardTitle>Color Picker</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="flex-1">
              <Label htmlFor="color-input">Pick a Color</Label>
              <div className="flex gap-2 mt-2">
                <input
                  id="color-input"
                  type="color"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="w-16 h-12 sm:h-10 rounded border cursor-pointer touch-manipulation"
                  style={{ WebkitAppearance: 'none', appearance: 'none' }}
                />
                <Input
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  placeholder="#000000"
                  className="font-mono text-sm"
                />
              </div>
            </div>
            
            <div 
              className="w-full h-20 sm:w-24 sm:h-24 rounded-lg border-2 border-border shadow-inner"
              style={{ backgroundColor: color }}
            />
          </div>
        </CardContent>
      </Card>

      {/* Color Values */}
      <Card>
        <CardHeader>
          <CardTitle>Color Values</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center justify-between p-3 bg-muted rounded">
              <div>
                <div className="font-semibold">HEX</div>
                <div className="font-mono text-sm">{colorValues.hex}</div>
              </div>
              <CopyButton text={colorValues.hex} />
            </div>
            
            <div className="flex items-center justify-between p-3 bg-muted rounded">
              <div>
                <div className="font-semibold">RGB</div>
                <div className="font-mono text-sm">
                  rgb({colorValues.rgb.r}, {colorValues.rgb.g}, {colorValues.rgb.b})
                </div>
              </div>
              <CopyButton text={`rgb(${colorValues.rgb.r}, ${colorValues.rgb.g}, ${colorValues.rgb.b})`} />
            </div>
            
            <div className="flex items-center justify-between p-3 bg-muted rounded">
              <div>
                <div className="font-semibold">HSL</div>
                <div className="font-mono text-sm">
                  hsl({colorValues.hsl.h}, {colorValues.hsl.s}%, {colorValues.hsl.l}%)
                </div>
              </div>
              <CopyButton text={`hsl(${colorValues.hsl.h}, ${colorValues.hsl.s}%, ${colorValues.hsl.l}%)`} />
            </div>
            
            <div className="flex items-center justify-between p-3 bg-muted rounded">
              <div>
                <div className="font-semibold">HSV</div>
                <div className="font-mono text-sm">
                  hsv({colorValues.hsv.h}, {colorValues.hsv.s}%, {colorValues.hsv.v}%)
                </div>
              </div>
              <CopyButton text={`hsv(${colorValues.hsv.h}, ${colorValues.hsv.s}%, ${colorValues.hsv.v}%)`} />
            </div>
            
            <div className="flex items-center justify-between p-3 bg-muted rounded md:col-span-2">
              <div>
                <div className="font-semibold">CMYK</div>
                <div className="font-mono text-sm">
                  cmyk({colorValues.cmyk.c}%, {colorValues.cmyk.m}%, {colorValues.cmyk.y}%, {colorValues.cmyk.k}%)
                </div>
              </div>
              <CopyButton text={`cmyk(${colorValues.cmyk.c}%, ${colorValues.cmyk.m}%, ${colorValues.cmyk.y}%, ${colorValues.cmyk.k}%)`} />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Color Palette */}
      <Card>
        <CardHeader>
          <CardTitle>Color Palette</CardTitle>
          <CardDescription>Lighter and darker variations of your selected color</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-5 sm:grid-cols-9 gap-2">
            {palette.map((paletteColor, index) => (
              <div key={index} className="relative group">
                <div
                  className="w-full h-12 sm:h-16 rounded cursor-pointer border-2 border-border hover:border-primary transition-colors touch-manipulation"
                  style={{ backgroundColor: paletteColor }}
                  onClick={() => setColor(paletteColor)}
                  title={paletteColor}
                />
                <div className="absolute inset-x-0 -bottom-6 text-xs text-center font-mono opacity-0 group-hover:opacity-100 transition-opacity">
                  {paletteColor}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Documentation */}
      <Card>
        <CardHeader>
          <CardTitle>About Color Picker</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-semibold mb-2">Color Formats:</h4>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
              <li><strong>HEX:</strong> Hexadecimal color notation (#RRGGBB)</li>
              <li><strong>RGB:</strong> Red, Green, Blue values (0-255)</li>
              <li><strong>HSL:</strong> Hue, Saturation, Lightness</li>
              <li><strong>HSV:</strong> Hue, Saturation, Value (Brightness)</li>
              <li><strong>CMYK:</strong> Cyan, Magenta, Yellow, Key (Black) - for printing</li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-2">Features:</h4>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
              <li>Visual color picker with live preview</li>
              <li>Multiple color format conversions</li>
              <li>Automatic palette generation</li>
              <li>One-click copy for all formats</li>
              <li>Click palette colors to select them</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-2">Use cases:</h4>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
              <li>Web design and CSS styling</li>
              <li>Brand color palette creation</li>
              <li>Converting between color formats</li>
              <li>Print design (CMYK values)</li>
              <li>UI/UX design workflows</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}