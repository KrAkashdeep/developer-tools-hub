'use client';

import { useState } from 'react';
import ToolLayout from '@/components/common/ToolLayout';
import InputBox from '@/components/common/InputBox';
import OutputBox from '@/components/common/OutputBox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import CollapsibleGuide from '@/components/common/CollapsibleGuide';

export default function RgbToHexTool() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [rgbValues, setRgbValues] = useState({ r: [255], g: [0], b: [0] });

  const rgbToHex = (r: number, g: number, b: number): string => {
    const toHex = (n: number): string => {
      const hex = Math.max(0, Math.min(255, Math.round(n))).toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    };
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
  };

  const parseRgbInput = (rgbString: string) => {
    if (!rgbString.trim()) {
      setOutput('');
      return;
    }

    try {
      // Try to parse different RGB formats
      let r, g, b;

      // Format: rgb(255, 0, 0) or rgba(255, 0, 0, 1)
      const rgbMatch = rgbString.match(/rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/i);
      if (rgbMatch) {
        r = parseInt(rgbMatch[1]);
        g = parseInt(rgbMatch[2]);
        b = parseInt(rgbMatch[3]);
      }
      // Format: 255, 0, 0 or 255 0 0
      else {
        const numbers = rgbString.match(/\d+/g);
        if (numbers && numbers.length >= 3) {
          r = parseInt(numbers[0]);
          g = parseInt(numbers[1]);
          b = parseInt(numbers[2]);
        } else {
          setOutput('Error: Invalid RGB format. Use "rgb(255, 0, 0)" or "255, 0, 0"');
          return;
        }
      }

      // Validate RGB values
      if (r < 0 || r > 255 || g < 0 || g > 255 || b < 0 || b > 255) {
        setOutput('Error: RGB values must be between 0 and 255');
        return;
      }

      const hex = rgbToHex(r, g, b);
      const result = `HEX: ${hex.toUpperCase()}\nRed: ${r}\nGreen: ${g}\nBlue: ${b}`;
      setOutput(result);

      // Update sliders
      setRgbValues({ r: [r], g: [g], b: [b] });
    } catch (error) {
      setOutput('Error: Invalid RGB format');
    }
  };

  const handleInputChange = (value: string) => {
    setInput(value);
    parseRgbInput(value);
  };

  const handleSliderChange = (color: 'r' | 'g' | 'b', value: number[]) => {
    const newRgbValues = { ...rgbValues, [color]: value };
    setRgbValues(newRgbValues);
    
    const r = newRgbValues.r[0];
    const g = newRgbValues.g[0];
    const b = newRgbValues.b[0];
    
    const hex = rgbToHex(r, g, b);
    const result = `HEX: ${hex.toUpperCase()}\nRed: ${r}\nGreen: ${g}\nBlue: ${b}`;
    setOutput(result);
    setInput(`rgb(${r}, ${g}, ${b})`);
  };

  const handleExample = () => {
    const example = 'rgb(59, 130, 246)';
    setInput(example);
    parseRgbInput(example);
  };

  const currentHex = rgbToHex(rgbValues.r[0], rgbValues.g[0], rgbValues.b[0]);

  return (
    <div className="space-y-6">
      <ToolLayout>
        <InputBox
          title="RGB Color"
          value={input}
          onChange={handleInputChange}
          placeholder="Enter RGB color (e.g., rgb(255, 0, 0) or 255, 0, 0)..."
          example="Load example RGB"
          onExample={handleExample}
        />
        
        <OutputBox
          title="HEX Color"
          value={output}
          placeholder="HEX color will appear here..."
        />
      </ToolLayout>

      {/* Color Preview */}
      <Card>
        <CardHeader>
          <CardTitle>Color Preview</CardTitle>
        </CardHeader>
        <CardContent>
          <div
            className="w-full h-32 rounded-lg border-2 border-border"
            style={{ backgroundColor: currentHex }}
          />
          <div className="text-center mt-2 font-mono text-sm">
            {currentHex.toUpperCase()}
          </div>
        </CardContent>
      </Card>

      {/* RGB Sliders */}
      <Card>
        <CardHeader>
          <CardTitle>RGB Sliders</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <div className="flex items-center justify-between mb-2">
              <Label className="text-red-600 font-semibold">Red</Label>
              <span className="text-sm font-mono">{rgbValues.r[0]}</span>
            </div>
            <Slider
              value={rgbValues.r}
              onValueChange={(value) => handleSliderChange('r', value)}
              max={255}
              step={1}
              className="w-full"
            />
          </div>
          
          <div>
            <div className="flex items-center justify-between mb-2">
              <Label className="text-green-600 font-semibold">Green</Label>
              <span className="text-sm font-mono">{rgbValues.g[0]}</span>
            </div>
            <Slider
              value={rgbValues.g}
              onValueChange={(value) => handleSliderChange('g', value)}
              max={255}
              step={1}
              className="w-full"
            />
          </div>
          
          <div>
            <div className="flex items-center justify-between mb-2">
              <Label className="text-blue-600 font-semibold">Blue</Label>
              <span className="text-sm font-mono">{rgbValues.b[0]}</span>
            </div>
            <Slider
              value={rgbValues.b}
              onValueChange={(value) => handleSliderChange('b', value)}
              max={255}
              step={1}
              className="w-full"
            />
          </div>
        </CardContent>
      </Card>

      {/* Common Colors */}
      <Card>
        <CardHeader>
          <CardTitle>Common RGB Colors</CardTitle>
          <CardDescription>Click any color to convert it</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { name: 'Red', rgb: 'rgb(255, 0, 0)', hex: '#FF0000' },
              { name: 'Green', rgb: 'rgb(0, 255, 0)', hex: '#00FF00' },
              { name: 'Blue', rgb: 'rgb(0, 0, 255)', hex: '#0000FF' },
              { name: 'Yellow', rgb: 'rgb(255, 255, 0)', hex: '#FFFF00' },
              { name: 'Cyan', rgb: 'rgb(0, 255, 255)', hex: '#00FFFF' },
              { name: 'Magenta', rgb: 'rgb(255, 0, 255)', hex: '#FF00FF' },
              { name: 'Black', rgb: 'rgb(0, 0, 0)', hex: '#000000' },
              { name: 'White', rgb: 'rgb(255, 255, 255)', hex: '#FFFFFF' },
            ].map((color, index) => (
              <div
                key={index}
                className="cursor-pointer hover:scale-105 transition-transform"
                onClick={() => {
                  setInput(color.rgb);
                  parseRgbInput(color.rgb);
                }}
              >
                <div
                  className="w-full h-16 rounded border-2 border-border"
                  style={{ backgroundColor: color.hex }}
                />
                <div className="text-center mt-1">
                  <div className="text-xs font-semibold">{color.name}</div>
                  <div className="text-xs font-mono text-muted-foreground">{color.rgb}</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Documentation */}
      <CollapsibleGuide title="RGB to HEX Converter Guide">
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold mb-2">Supported RGB Formats:</h4>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
              <li><strong>CSS format:</strong> rgb(255, 0, 0) or rgba(255, 0, 0, 1)</li>
              <li><strong>Comma separated:</strong> 255, 0, 0</li>
              <li><strong>Space separated:</strong> 255 0 0</li>
              <li><strong>Numbers only:</strong> 255 0 0 (extracted automatically)</li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-2">Features:</h4>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
              <li>Converts RGB values (0-255) to hexadecimal format</li>
              <li>Interactive RGB sliders for visual color selection</li>
              <li>Real-time color preview</li>
              <li>Supports multiple RGB input formats</li>
              <li>Validates RGB value ranges</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-2">About RGB and HEX:</h4>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
              <li><strong>RGB:</strong> Red, Green, Blue values from 0-255</li>
              <li><strong>HEX:</strong> Hexadecimal representation (#RRGGBB)</li>
              <li>Both represent the same colors in different formats</li>
              <li>HEX is commonly used in web development and design</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-2">Use Cases:</h4>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
              <li>Converting CSS rgb() values to hex codes</li>
              <li>Design tool color format conversion</li>
              <li>Web development color management</li>
              <li>Color palette creation and documentation</li>
            </ul>
          </div>
        </div>
      </CollapsibleGuide>
    </div>
  );
}