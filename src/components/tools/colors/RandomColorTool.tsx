'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import CopyButton from '@/components/common/CopyButton';
import { IconRefresh } from '@tabler/icons-react';
import CollapsibleGuide from '@/components/common/CollapsibleGuide';

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

      <CollapsibleGuide title="Random Color Generator Guide">
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold mb-2">What it does:</h4>
            <p className="text-sm text-muted-foreground">
              Generates random hexadecimal colors for design inspiration, testing, or placeholder content.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-2">Features:</h4>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
              <li>Generate multiple random colors at once</li>
              <li>Copy individual color codes with one click</li>
              <li>Visual color preview with hex codes</li>
              <li>Refresh to generate new color sets</li>
              <li>Perfect for design mockups and prototypes</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-2">Use cases:</h4>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
              <li>Design inspiration and color exploration</li>
              <li>Placeholder colors for development</li>
              <li>Testing color combinations</li>
              <li>Creating diverse color palettes</li>
              <li>UI/UX design experimentation</li>
            </ul>
          </div>
        </div>
      </CollapsibleGuide>
    </div>
  );
}