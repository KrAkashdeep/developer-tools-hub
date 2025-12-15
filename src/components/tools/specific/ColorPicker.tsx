import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import CopyButton from '@/components/common/CopyButton';
import Breadcrumb from '@/components/common/Breadcrumb';
import { hexToRgb, rgbToHsl, rgbToHex, hslToRgb, isValidHex, parseRgb } from '@/lib/utils/colors';
import { Tool } from '@/lib/types';

interface ColorPickerProps {
  tool: Tool;
}

interface ColorValues {
  hex: string;
  rgb: string;
  hsl: string;
  r: number;
  g: number;
  b: number;
  h: number;
  s: number;
  l: number;
}

export function ColorPicker({ tool }: ColorPickerProps) {
  const [colorValues, setColorValues] = useState<ColorValues>({
    hex: '#ff5733',
    rgb: 'rgb(255, 87, 51)',
    hsl: 'hsl(9, 100%, 60%)',
    r: 255,
    g: 87,
    b: 51,
    h: 9,
    s: 100,
    l: 60
  });

  const updateColorFromHex = useCallback((hex: string) => {
    if (!isValidHex(hex)) return;

    const rgbResult = hexToRgb(hex);
    if (!rgbResult.success || !rgbResult.color) return;

    const rgbValues = parseRgb(rgbResult.color);
    if (!rgbValues) return;

    const hslResult = rgbToHsl(rgbValues.r, rgbValues.g, rgbValues.b);
    if (!hslResult.success || !hslResult.color) return;

    // Parse HSL values
    const hslMatch = hslResult.color.match(/hsl\(\s*(\d+)\s*,\s*(\d+)%\s*,\s*(\d+)%\s*\)/);
    if (!hslMatch) return;

    setColorValues({
      hex: hex.toLowerCase(),
      rgb: rgbResult.color,
      hsl: hslResult.color,
      r: rgbValues.r,
      g: rgbValues.g,
      b: rgbValues.b,
      h: parseInt(hslMatch[1]),
      s: parseInt(hslMatch[2]),
      l: parseInt(hslMatch[3])
    });
  }, []);

  const updateColorFromRgb = useCallback((r: number, g: number, b: number) => {
    const hexResult = rgbToHex(r, g, b);
    const hslResult = rgbToHsl(r, g, b);
    
    if (!hexResult.success || !hslResult.success) return;

    // Parse HSL values
    const hslMatch = hslResult.color?.match(/hsl\(\s*(\d+)\s*,\s*(\d+)%\s*,\s*(\d+)%\s*\)/);
    if (!hslMatch) return;

    setColorValues({
      hex: hexResult.color || '',
      rgb: `rgb(${r}, ${g}, ${b})`,
      hsl: hslResult.color || '',
      r,
      g,
      b,
      h: parseInt(hslMatch[1]),
      s: parseInt(hslMatch[2]),
      l: parseInt(hslMatch[3])
    });
  }, []);

  const updateColorFromHsl = useCallback((h: number, s: number, l: number) => {
    const rgbResult = hslToRgb(h, s, l);
    if (!rgbResult.success || !rgbResult.color) return;

    const rgbValues = parseRgb(rgbResult.color);
    if (!rgbValues) return;

    const hexResult = rgbToHex(rgbValues.r, rgbValues.g, rgbValues.b);
    if (!hexResult.success) return;

    setColorValues({
      hex: hexResult.color || '',
      rgb: rgbResult.color,
      hsl: `hsl(${h}, ${s}%, ${l}%)`,
      r: rgbValues.r,
      g: rgbValues.g,
      b: rgbValues.b,
      h,
      s,
      l
    });
  }, []);

  const handleHexChange = (value: string) => {
    if (value.startsWith('#')) {
      updateColorFromHex(value);
    } else if (value.length > 0) {
      updateColorFromHex('#' + value);
    }
  };

  const handleRgbChange = (component: 'r' | 'g' | 'b', value: number) => {
    const newValues = { ...colorValues };
    newValues[component] = Math.max(0, Math.min(255, value));
    updateColorFromRgb(newValues.r, newValues.g, newValues.b);
  };

  const handleHslChange = (component: 'h' | 's' | 'l', value: number) => {
    const newValues = { ...colorValues };
    if (component === 'h') {
      newValues[component] = Math.max(0, Math.min(360, value));
    } else {
      newValues[component] = Math.max(0, Math.min(100, value));
    }
    updateColorFromHsl(newValues.h, newValues.s, newValues.l);
  };

  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl">
      {/* Breadcrumb Navigation */}
      <Breadcrumb 
        items={[
          { label: 'Home', href: '/' },
          { label: 'Tools', href: '/tools' },
          { label: tool.name, href: `/tools/${tool.slug}` }
        ]}
      />

      {/* Tool Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{tool.name}</h1>
        <p className="text-lg text-muted-foreground">{tool.description}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Color Preview and Picker */}
        <Card>
          <CardHeader>
            <CardTitle>Color Preview</CardTitle>
            <CardDescription>Visual representation of the selected color</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Large Color Preview */}
            <div 
              className="w-full h-32 rounded-lg border-2 border-border shadow-inner"
              style={{ backgroundColor: colorValues.hex }}
              data-testid="color-preview"
            />
            
            {/* HTML Color Input */}
            <div className="space-y-2">
              <Label htmlFor="color-input">Pick a Color</Label>
              <Input
                id="color-input"
                type="color"
                value={colorValues.hex}
                onChange={(e) => handleHexChange(e.target.value)}
                className="w-full h-12 cursor-pointer"
                data-testid="color-input"
              />
            </div>
          </CardContent>
        </Card>

        {/* Color Values */}
        <Card>
          <CardHeader>
            <CardTitle>Color Values</CardTitle>
            <CardDescription>Color values in different formats</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* HEX */}
            <div className="space-y-2">
              <Label htmlFor="hex-input">HEX</Label>
              <div className="flex gap-2">
                <Input
                  id="hex-input"
                  value={colorValues.hex}
                  onChange={(e) => handleHexChange(e.target.value)}
                  placeholder="#FF5733"
                  className="font-mono"
                  data-testid="hex-input"
                />
                <CopyButton text={colorValues.hex} />
              </div>
            </div>

            {/* RGB */}
            <div className="space-y-2">
              <Label>RGB</Label>
              <div className="flex gap-2">
                <Input
                  value={colorValues.rgb}
                  readOnly
                  className="font-mono bg-muted"
                  data-testid="rgb-display"
                />
                <CopyButton text={colorValues.rgb} />
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <Label htmlFor="r-input" className="text-xs">R</Label>
                  <Input
                    id="r-input"
                    type="number"
                    min="0"
                    max="255"
                    value={colorValues.r}
                    onChange={(e) => handleRgbChange('r', parseInt(e.target.value) || 0)}
                    className="text-center"
                    data-testid="r-input"
                  />
                </div>
                <div>
                  <Label htmlFor="g-input" className="text-xs">G</Label>
                  <Input
                    id="g-input"
                    type="number"
                    min="0"
                    max="255"
                    value={colorValues.g}
                    onChange={(e) => handleRgbChange('g', parseInt(e.target.value) || 0)}
                    className="text-center"
                    data-testid="g-input"
                  />
                </div>
                <div>
                  <Label htmlFor="b-input" className="text-xs">B</Label>
                  <Input
                    id="b-input"
                    type="number"
                    min="0"
                    max="255"
                    value={colorValues.b}
                    onChange={(e) => handleRgbChange('b', parseInt(e.target.value) || 0)}
                    className="text-center"
                    data-testid="b-input"
                  />
                </div>
              </div>
            </div>

            {/* HSL */}
            <div className="space-y-2">
              <Label>HSL</Label>
              <div className="flex gap-2">
                <Input
                  value={colorValues.hsl}
                  readOnly
                  className="font-mono bg-muted"
                  data-testid="hsl-display"
                />
                <CopyButton text={colorValues.hsl} />
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <Label htmlFor="h-input" className="text-xs">H</Label>
                  <Input
                    id="h-input"
                    type="number"
                    min="0"
                    max="360"
                    value={colorValues.h}
                    onChange={(e) => handleHslChange('h', parseInt(e.target.value) || 0)}
                    className="text-center"
                    data-testid="h-input"
                  />
                </div>
                <div>
                  <Label htmlFor="s-input" className="text-xs">S (%)</Label>
                  <Input
                    id="s-input"
                    type="number"
                    min="0"
                    max="100"
                    value={colorValues.s}
                    onChange={(e) => handleHslChange('s', parseInt(e.target.value) || 0)}
                    className="text-center"
                    data-testid="s-input"
                  />
                </div>
                <div>
                  <Label htmlFor="l-input" className="text-xs">L (%)</Label>
                  <Input
                    id="l-input"
                    type="number"
                    min="0"
                    max="100"
                    value={colorValues.l}
                    onChange={(e) => handleHslChange('l', parseInt(e.target.value) || 0)}
                    className="text-center"
                    data-testid="l-input"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}