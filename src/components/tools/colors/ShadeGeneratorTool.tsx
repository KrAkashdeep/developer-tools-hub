'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import CopyButton from '@/components/common/CopyButton';
import CollapsibleGuide from '@/components/common/CollapsibleGuide';

export default function ShadeGeneratorTool() {
  const [baseColor, setBaseColor] = useState('#3b82f6');
  const [shadeCount, setShadeCount] = useState([9]);
  const [shades, setShades] = useState<string[]>([]);

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

  // Generate shades by darkening the base color
  const generateShades = (color: string, count: number): string[] => {
    const rgb = hexToRgb(color);
    const shades: string[] = [];
    
    // Add the original color in the middle
    const middleIndex = Math.floor(count / 2);
    
    for (let i = 0; i < count; i++) {
      if (i === middleIndex) {
        // Original color
        shades.push(color);
      } else if (i < middleIndex) {
        // Lighter shades (add white)
        const factor = (middleIndex - i) / middleIndex;
        const r = rgb.r + (255 - rgb.r) * factor;
        const g = rgb.g + (255 - rgb.g) * factor;
        const b = rgb.b + (255 - rgb.b) * factor;
        shades.push(rgbToHex(r, g, b));
      } else {
        // Darker shades (subtract from RGB values)
        const factor = (i - middleIndex) / (count - middleIndex - 1);
        const r = rgb.r * (1 - factor);
        const g = rgb.g * (1 - factor);
        const b = rgb.b * (1 - factor);
        shades.push(rgbToHex(r, g, b));
      }
    }
    
    return shades;
  };

  // Update shades when base color or count changes
  useEffect(() => {
    const newShades = generateShades(baseColor, shadeCount[0]);
    setShades(newShades);
  }, [baseColor, shadeCount]);

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
    { name: 'Yellow', color: '#eab308' },
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
              <Label>Number of Shades</Label>
              <span className="text-sm font-mono">{shadeCount[0]}</span>
            </div>
            <Slider
              value={shadeCount}
              onValueChange={setShadeCount}
              min={3}
              max={15}
              step={2}
              className="w-full"
            />
          </div>
        </CardContent>
      </Card>

      {/* Generated Shades */}
      <Card>
        <CardHeader>
          <CardTitle>Generated Shades</CardTitle>
          <CardDescription>From lightest to darkest variations of your base color</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {shades.map((shade, index) => {
              const textColor = getTextColor(shade);
              const isBaseColor = index === Math.floor(shades.length / 2);
              
              return (
                <div key={index} className="flex items-center gap-4">
                  <div className="flex-shrink-0 w-16 text-sm text-muted-foreground">
                    {isBaseColor ? 'Base' : index < Math.floor(shades.length / 2) ? `+${Math.floor(shades.length / 2) - index}` : `-${index - Math.floor(shades.length / 2)}`}
                  </div>
                  <div
                    className="flex-1 p-4 rounded-lg border-2 border-border flex items-center justify-between"
                    style={{ backgroundColor: shade, color: textColor }}
                  >
                    <div>
                      <div className="font-semibold">
                        {isBaseColor ? 'Base Color' : index < Math.floor(shades.length / 2) ? 'Lighter' : 'Darker'}
                      </div>
                      <div className="font-mono text-sm opacity-90">{shade.toUpperCase()}</div>
                    </div>
                    <CopyButton text={shade.toUpperCase()} />
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* CSS Variables */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>CSS Variables</CardTitle>
            <CopyButton text={shades.map((shade, index) => `  --shade-${index + 1}: ${shade.toUpperCase()};`).join('\n')} />
          </div>
        </CardHeader>
        <CardContent>
          <pre className="bg-muted p-4 rounded font-mono text-sm overflow-x-auto">
{`:root {
${shades.map((shade, index) => `  --shade-${index + 1}: ${shade.toUpperCase()};`).join('\n')}
}`}
          </pre>
        </CardContent>
      </Card>

      {/* Tailwind CSS Classes */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Tailwind CSS Classes</CardTitle>
            <CopyButton text={shades.map((shade, index) => `'shade-${index + 1}': '${shade.toUpperCase()}'`).join(',\n')} />
          </div>
        </CardHeader>
        <CardContent>
          <pre className="bg-muted p-4 rounded font-mono text-sm overflow-x-auto">
{`colors: {
${shades.map((shade, index) => `  'shade-${index + 1}': '${shade.toUpperCase()}'`).join(',\n')}
}`}
          </pre>
        </CardContent>
      </Card>

      {/* Common Base Colors */}
      <Card>
        <CardHeader>
          <CardTitle>Common Base Colors</CardTitle>
          <CardDescription>Click any color to generate its shades</CardDescription>
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
      <CollapsibleGuide title="Shade Generator Guide">
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold mb-2">What are Color Shades?</h4>
            <p className="text-sm text-muted-foreground">
              Shades are variations of a color created by adding black (making it darker) or white (making it lighter). 
              This tool generates a range from light to dark variations of your base color.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-2">Features:</h4>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
              <li>Generate 3-15 shade variations</li>
              <li>Base color positioned in the middle</li>
              <li>Automatic contrast-aware text colors</li>
              <li>Ready-to-use CSS variables</li>
              <li>Tailwind CSS color configuration</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-2">Use Cases:</h4>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
              <li>Creating consistent color palettes</li>
              <li>Design system development</li>
              <li>UI component theming</li>
              <li>Brand color variations</li>
              <li>Accessibility-compliant color schemes</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-2">Tips:</h4>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
              <li>Use odd numbers of shades for balanced palettes</li>
              <li>Test shades in your actual design context</li>
              <li>Consider accessibility when using lighter/darker shades</li>
              <li>Save generated CSS variables for consistent usage</li>
            </ul>
          </div>
        </div>
      </CollapsibleGuide>
    </div>
  );
}