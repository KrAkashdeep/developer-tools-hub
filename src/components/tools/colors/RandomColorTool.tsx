'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import CopyButton from '@/components/common/CopyButton';
import { IconRefresh } from '@tabler/icons-react';

export default function RandomColorTool() {
  const [colors, setColors] = useState<string[]>([]);

  const generateRandomColor = () => {
    return '#' + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0');
  };

  const generateColors = (count: number = 8) => {
    const newColors = Array.from({ length: count }, () => generateRandomColor());
    setColors(newColors);
  };

  // Generate initial colors
  useState(() => {
    generateColors();
  });

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Random Color Generator</CardTitle>
            <Button onClick={() => generateColors()} className="flex items-center gap-2">
              <IconRefresh className="h-4 w-4" />
              Generate New Colors
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {colors.map((color, index) => (
              <div key={index} className="space-y-2">
                <div
                  className="w-full h-24 rounded-lg border-2 border-border"
                  style={{ backgroundColor: color }}
                />
                <div className="flex items-center justify-between">
                  <span className="font-mono text-sm">{color}</span>
                  <CopyButton text={color} />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>About Random Color Generator</CardTitle>
        </CardHeader>
        <CardContent>
          <CardDescription>
            Generates random hexadecimal colors for design inspiration, testing, or placeholder content.
          </CardDescription>
        </CardContent>
      </Card>
    </div>
  );
}