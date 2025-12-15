'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import CopyButton from '@/components/common/CopyButton';
import { IconRefresh } from '@tabler/icons-react';

export default function GradientGeneratorTool() {
  const [color1, setColor1] = useState('#3b82f6');
  const [color2, setColor2] = useState('#8b5cf6');
  const [direction, setDirection] = useState('to right');
  const [cssCode, setCssCode] = useState('');

  const generateGradient = () => {
    const gradient = `linear-gradient(${direction}, ${color1}, ${color2})`;
    setCssCode(`background: ${gradient};`);
  };

  const generateRandomColors = () => {
    const randomColor1 = '#' + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0');
    const randomColor2 = '#' + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0');
    setColor1(randomColor1);
    setColor2(randomColor2);
  };

  // Generate initial gradient
  useState(() => {
    generateGradient();
  });

  // Update gradient when colors or direction change
  useState(() => {
    generateGradient();
  });

  const gradientStyle = {
    background: `linear-gradient(${direction}, ${color1}, ${color2})`
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Gradient Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="color1">Color 1</Label>
              <div className="flex gap-2 mt-2">
                <input
                  type="color"
                  id="color1"
                  value={color1}
                  onChange={(e) => setColor1(e.target.value)}
                  className="w-12 h-10 rounded border cursor-pointer"
                />
                <input
                  type="text"
                  value={color1}
                  onChange={(e) => setColor1(e.target.value)}
                  className="flex-1 px-3 py-2 border rounded font-mono text-sm"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="color2">Color 2</Label>
              <div className="flex gap-2 mt-2">
                <input
                  type="color"
                  id="color2"
                  value={color2}
                  onChange={(e) => setColor2(e.target.value)}
                  className="w-12 h-10 rounded border cursor-pointer"
                />
                <input
                  type="text"
                  value={color2}
                  onChange={(e) => setColor2(e.target.value)}
                  className="flex-1 px-3 py-2 border rounded font-mono text-sm"
                />
              </div>
            </div>
          </div>

          <div>
            <Label htmlFor="direction">Direction</Label>
            <select
              id="direction"
              value={direction}
              onChange={(e) => setDirection(e.target.value)}
              className="w-full mt-2 px-3 py-2 border rounded"
            >
              <option value="to right">To Right</option>
              <option value="to left">To Left</option>
              <option value="to bottom">To Bottom</option>
              <option value="to top">To Top</option>
              <option value="to bottom right">To Bottom Right</option>
              <option value="to bottom left">To Bottom Left</option>
              <option value="to top right">To Top Right</option>
              <option value="to top left">To Top Left</option>
            </select>
          </div>

          <Button onClick={generateRandomColors} className="flex items-center gap-2">
            <IconRefresh className="h-4 w-4" />
            Random Colors
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Gradient Preview</CardTitle>
        </CardHeader>
        <CardContent>
          <div
            className="w-full h-32 rounded-lg border-2 border-border"
            style={gradientStyle}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>CSS Code</CardTitle>
            <CopyButton text={cssCode} />
          </div>
        </CardHeader>
        <CardContent>
          <pre className="bg-muted p-4 rounded font-mono text-sm overflow-x-auto">
            {cssCode}
          </pre>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>CSS Gradient Generator</CardTitle>
        </CardHeader>
        <CardContent>
          <CardDescription>
            Create beautiful CSS gradients with customizable colors and directions.
          </CardDescription>
        </CardContent>
      </Card>
    </div>
  );
}