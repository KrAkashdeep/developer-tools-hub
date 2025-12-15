import React, { useState } from 'react';
import { ToolPageLayout } from '../ToolPageLayout';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { hexToRgb, rgbToHex, rgbToHsl, hslToRgb, parseRgb, parseHsl, isValidHex } from '@/lib/utils/colors';
import { Tool } from '@/lib/types';

interface ColorConverterProps {
  tool: Tool;
}

type ColorFormat = 'hex-to-rgb' | 'rgb-to-hex' | 'rgb-to-hsl' | 'hsl-to-rgb' | 'hex-to-hsl' | 'hsl-to-hex';

export function ColorConverter({ tool }: ColorConverterProps) {
  const [conversionType, setConversionType] = useState<ColorFormat>('hex-to-rgb');

  const handleProcess = (input: string) => {
    if (!input.trim()) {
      return { output: '' };
    }

    const trimmedInput = input.trim();

    try {
      switch (conversionType) {
        case 'hex-to-rgb': {
          const result = hexToRgb(trimmedInput);
          return {
            output: result.success ? result.color || '' : '',
            error: result.error
          };
        }
        
        case 'rgb-to-hex': {
          const rgbValues = parseRgb(trimmedInput);
          if (!rgbValues) {
            return { output: '', error: 'Invalid RGB format. Use: rgb(255, 255, 255)' };
          }
          const result = rgbToHex(rgbValues.r, rgbValues.g, rgbValues.b);
          return {
            output: result.success ? result.color || '' : '',
            error: result.error
          };
        }
        
        case 'rgb-to-hsl': {
          const rgbValues = parseRgb(trimmedInput);
          if (!rgbValues) {
            return { output: '', error: 'Invalid RGB format. Use: rgb(255, 255, 255)' };
          }
          const result = rgbToHsl(rgbValues.r, rgbValues.g, rgbValues.b);
          return {
            output: result.success ? result.color || '' : '',
            error: result.error
          };
        }
        
        case 'hsl-to-rgb': {
          const hslValues = parseHsl(trimmedInput);
          if (!hslValues) {
            return { output: '', error: 'Invalid HSL format. Use: hsl(360, 100%, 50%)' };
          }
          const result = hslToRgb(hslValues.h, hslValues.s, hslValues.l);
          return {
            output: result.success ? result.color || '' : '',
            error: result.error
          };
        }
        
        case 'hex-to-hsl': {
          // Convert HEX to RGB first, then RGB to HSL
          const rgbResult = hexToRgb(trimmedInput);
          if (!rgbResult.success || !rgbResult.color) {
            return { output: '', error: rgbResult.error };
          }
          
          const rgbValues = parseRgb(rgbResult.color);
          if (!rgbValues) {
            return { output: '', error: 'Failed to parse RGB values' };
          }
          
          const hslResult = rgbToHsl(rgbValues.r, rgbValues.g, rgbValues.b);
          return {
            output: hslResult.success ? hslResult.color || '' : '',
            error: hslResult.error
          };
        }
        
        case 'hsl-to-hex': {
          // Convert HSL to RGB first, then RGB to HEX
          const hslValues = parseHsl(trimmedInput);
          if (!hslValues) {
            return { output: '', error: 'Invalid HSL format. Use: hsl(360, 100%, 50%)' };
          }
          
          const rgbResult = hslToRgb(hslValues.h, hslValues.s, hslValues.l);
          if (!rgbResult.success || !rgbResult.color) {
            return { output: '', error: rgbResult.error };
          }
          
          const rgbValues = parseRgb(rgbResult.color);
          if (!rgbValues) {
            return { output: '', error: 'Failed to parse RGB values' };
          }
          
          const hexResult = rgbToHex(rgbValues.r, rgbValues.g, rgbValues.b);
          return {
            output: hexResult.success ? hexResult.color || '' : '',
            error: hexResult.error
          };
        }
        
        default:
          return { output: '', error: 'Unknown conversion type' };
      }
    } catch (error) {
      return {
        output: '',
        error: error instanceof Error ? error.message : 'Conversion failed'
      };
    }
  };

  const getPlaceholder = () => {
    switch (conversionType) {
      case 'hex-to-rgb':
      case 'hex-to-hsl':
        return 'Enter HEX color (e.g., #FF5733 or FF5733)...';
      case 'rgb-to-hex':
      case 'rgb-to-hsl':
        return 'Enter RGB color (e.g., rgb(255, 87, 51))...';
      case 'hsl-to-rgb':
      case 'hsl-to-hex':
        return 'Enter HSL color (e.g., hsl(9, 100%, 60%))...';
      default:
        return 'Enter color value...';
    }
  };

  const getOutputPlaceholder = () => {
    switch (conversionType) {
      case 'hex-to-rgb':
      case 'hsl-to-rgb':
        return 'RGB color will appear here...';
      case 'rgb-to-hex':
      case 'hsl-to-hex':
        return 'HEX color will appear here...';
      case 'rgb-to-hsl':
      case 'hex-to-hsl':
        return 'HSL color will appear here...';
      default:
        return 'Converted color will appear here...';
    }
  };

  const options = (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="conversion-type">Conversion Type</Label>
        <Select value={conversionType} onValueChange={(value: ColorFormat) => setConversionType(value)}>
          <SelectTrigger id="conversion-type" className="w-64">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="hex-to-rgb">HEX to RGB</SelectItem>
            <SelectItem value="rgb-to-hex">RGB to HEX</SelectItem>
            <SelectItem value="rgb-to-hsl">RGB to HSL</SelectItem>
            <SelectItem value="hsl-to-rgb">HSL to RGB</SelectItem>
            <SelectItem value="hex-to-hsl">HEX to HSL</SelectItem>
            <SelectItem value="hsl-to-hex">HSL to HEX</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );

  return (
    <ToolPageLayout
      tool={tool}
      onProcess={handleProcess}
      options={options}
      placeholder={getPlaceholder()}
      outputPlaceholder={getOutputPlaceholder()}
    />
  );
}