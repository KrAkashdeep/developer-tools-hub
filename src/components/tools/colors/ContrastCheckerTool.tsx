'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import CopyButton from '@/components/common/CopyButton';

interface ContrastResult {
  ratio: number;
  aaSmall: boolean;
  aaLarge: boolean;
  aaaSmall: boolean;
  aaaLarge: boolean;
}

export default function ContrastCheckerTool() {
  const [foregroundColor, setForegroundColor] = useState('#000000');
  const [backgroundColor, setBackgroundColor] = useState('#ffffff');
  const [contrastResult, setContrastResult] = useState<ContrastResult>({
    ratio: 21,
    aaSmall: true,
    aaLarge: true,
    aaaSmall: true,
    aaaLarge: true
  });

  // Convert hex to RGB
  const hexToRgb = (hex: string): { r: number; g: number; b: number } | null => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  };

  // Calculate relative luminance
  const getLuminance = (r: number, g: number, b: number): number => {
    const [rs, gs, bs] = [r, g, b].map(c => {
      c = c / 255;
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
  };

  // Calculate contrast ratio
  const getContrastRatio = (color1: string, color2: string): number => {
    const rgb1 = hexToRgb(color1);
    const rgb2 = hexToRgb(color2);
    
    if (!rgb1 || !rgb2) return 1;
    
    const lum1 = getLuminance(rgb1.r, rgb1.g, rgb1.b);
    const lum2 = getLuminance(rgb2.r, rgb2.g, rgb2.b);
    
    const brightest = Math.max(lum1, lum2);
    const darkest = Math.min(lum1, lum2);
    
    return (brightest + 0.05) / (darkest + 0.05);
  };

  // Update contrast calculation when colors change
  useEffect(() => {
    const ratio = getContrastRatio(foregroundColor, backgroundColor);
    
    setContrastResult({
      ratio: Math.round(ratio * 100) / 100,
      aaSmall: ratio >= 4.5,
      aaLarge: ratio >= 3,
      aaaSmall: ratio >= 7,
      aaaLarge: ratio >= 4.5
    });
  }, [foregroundColor, backgroundColor]);

  const swapColors = () => {
    const temp = foregroundColor;
    setForegroundColor(backgroundColor);
    setBackgroundColor(temp);
  };

  const commonColorPairs = [
    { name: 'Black on White', fg: '#000000', bg: '#ffffff' },
    { name: 'White on Black', fg: '#ffffff', bg: '#000000' },
    { name: 'Blue on White', fg: '#0066cc', bg: '#ffffff' },
    { name: 'White on Blue', fg: '#ffffff', bg: '#0066cc' },
    { name: 'Dark Gray on Light Gray', fg: '#333333', bg: '#f5f5f5' },
    { name: 'Green on White', fg: '#008000', bg: '#ffffff' },
    { name: 'Red on White', fg: '#cc0000', bg: '#ffffff' },
    { name: 'Purple on Light Purple', fg: '#663399', bg: '#f0e6ff' },
  ];

  return (
    <div className="space-y-6">
      {/* Color Input */}
      <Card>
        <CardHeader>
          <CardTitle>Color Selection</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="foreground">Foreground Color (Text)</Label>
              <div className="flex gap-2 mt-2">
                <input
                  type="color"
                  value={foregroundColor}
                  onChange={(e) => setForegroundColor(e.target.value)}
                  className="w-16 h-10 rounded border cursor-pointer"
                />
                <Input
                  value={foregroundColor}
                  onChange={(e) => setForegroundColor(e.target.value)}
                  placeholder="#000000"
                  className="font-mono"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="background">Background Color</Label>
              <div className="flex gap-2 mt-2">
                <input
                  type="color"
                  value={backgroundColor}
                  onChange={(e) => setBackgroundColor(e.target.value)}
                  className="w-16 h-10 rounded border cursor-pointer"
                />
                <Input
                  value={backgroundColor}
                  onChange={(e) => setBackgroundColor(e.target.value)}
                  placeholder="#ffffff"
                  className="font-mono"
                />
              </div>
            </div>
          </div>
          
          <button
            onClick={swapColors}
            className="w-full px-4 py-2 border rounded hover:bg-muted transition-colors"
          >
            ↔ Swap Colors
          </button>
        </CardContent>
      </Card>

      {/* Preview */}
      <Card>
        <CardHeader>
          <CardTitle>Color Preview</CardTitle>
        </CardHeader>
        <CardContent>
          <div
            className="p-8 rounded-lg border-2 border-border"
            style={{ backgroundColor: backgroundColor, color: foregroundColor }}
          >
            <h3 className="text-2xl font-bold mb-4">Sample Heading Text</h3>
            <p className="text-base mb-4">
              This is regular paragraph text to demonstrate how the color combination looks 
              in practice. The contrast ratio affects readability significantly.
            </p>
            <p className="text-sm">
              This is smaller text that might be harder to read with poor contrast.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Contrast Results */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Contrast Analysis</CardTitle>
            <CopyButton text={`Contrast Ratio: ${contrastResult.ratio}:1`} />
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center">
            <div className="text-4xl font-bold mb-2">{contrastResult.ratio}:1</div>
            <div className="text-muted-foreground">Contrast Ratio</div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-3">
              <h4 className="font-semibold">WCAG AA Compliance</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Normal Text (4.5:1)</span>
                  <Badge variant={contrastResult.aaSmall ? 'secondary' : 'destructive'}>
                    {contrastResult.aaSmall ? 'Pass' : 'Fail'}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Large Text (3:1)</span>
                  <Badge variant={contrastResult.aaLarge ? 'secondary' : 'destructive'}>
                    {contrastResult.aaLarge ? 'Pass' : 'Fail'}
                  </Badge>
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              <h4 className="font-semibold">WCAG AAA Compliance</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Normal Text (7:1)</span>
                  <Badge variant={contrastResult.aaaSmall ? 'secondary' : 'destructive'}>
                    {contrastResult.aaaSmall ? 'Pass' : 'Fail'}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Large Text (4.5:1)</span>
                  <Badge variant={contrastResult.aaaLarge ? 'secondary' : 'destructive'}>
                    {contrastResult.aaaLarge ? 'Pass' : 'Fail'}
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Common Color Pairs */}
      <Card>
        <CardHeader>
          <CardTitle>Common Color Combinations</CardTitle>
          <CardDescription>Click any combination to test it</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {commonColorPairs.map((pair, index) => {
              const ratio = getContrastRatio(pair.fg, pair.bg);
              const passes = ratio >= 4.5;
              
              return (
                <div
                  key={index}
                  className="p-3 border rounded cursor-pointer hover:bg-muted transition-colors"
                  onClick={() => {
                    setForegroundColor(pair.fg);
                    setBackgroundColor(pair.bg);
                  }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-sm">{pair.name}</span>
                    <Badge variant={passes ? 'secondary' : 'destructive'} className="text-xs">
                      {Math.round(ratio * 100) / 100}:1
                    </Badge>
                  </div>
                  <div
                    className="p-2 rounded text-sm text-center"
                    style={{ backgroundColor: pair.bg, color: pair.fg }}
                  >
                    Sample Text
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Documentation */}
      <Card>
        <CardHeader>
          <CardTitle>About Contrast Checking</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-semibold mb-2">WCAG Guidelines:</h4>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
              <li><strong>AA Normal Text:</strong> Minimum 4.5:1 contrast ratio</li>
              <li><strong>AA Large Text:</strong> Minimum 3:1 contrast ratio (18pt+ or 14pt+ bold)</li>
              <li><strong>AAA Normal Text:</strong> Minimum 7:1 contrast ratio (enhanced)</li>
              <li><strong>AAA Large Text:</strong> Minimum 4.5:1 contrast ratio (enhanced)</li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-2">Why Contrast Matters:</h4>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
              <li>Ensures readability for users with visual impairments</li>
              <li>Improves usability in different lighting conditions</li>
              <li>Required for accessibility compliance</li>
              <li>Better user experience for everyone</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-2">Tips for Better Contrast:</h4>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
              <li>Test your color combinations early in design</li>
              <li>Consider users with color vision deficiencies</li>
              <li>Don't rely on color alone to convey information</li>
              <li>Test on different devices and lighting conditions</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}