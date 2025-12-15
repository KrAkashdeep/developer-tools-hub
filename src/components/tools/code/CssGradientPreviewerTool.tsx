'use client';

import { useState } from 'react';
import ToolLayout from '@/components/common/ToolLayout';
import InputBox from '@/components/common/InputBox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import CopyButton from '@/components/common/CopyButton';
import { IconRefresh } from '@tabler/icons-react';

export default function CssGradientPreviewerTool() {
  const [input, setInput] = useState('');
  const [gradientStyle, setGradientStyle] = useState<React.CSSProperties>({});
  const [isValid, setIsValid] = useState(false);
  const [error, setError] = useState('');

  const parseGradient = (cssGradient: string) => {
    if (!cssGradient.trim()) {
      setGradientStyle({});
      setIsValid(false);
      setError('');
      return;
    }

    try {
      // Create a temporary element to test the CSS
      const testElement = document.createElement('div');
      testElement.style.background = cssGradient;
      
      // If the browser accepts the CSS, it will be applied
      if (testElement.style.background) {
        setGradientStyle({ background: cssGradient });
        setIsValid(true);
        setError('');
      } else {
        setGradientStyle({});
        setIsValid(false);
        setError('Invalid CSS gradient syntax');
      }
    } catch (err) {
      setGradientStyle({});
      setIsValid(false);
      setError('Error parsing CSS gradient');
    }
  };

  const handleInputChange = (value: string) => {
    setInput(value);
    parseGradient(value);
  };

  const handleExample = () => {
    const example = 'linear-gradient(45deg, #ff6b6b, #4ecdc4, #45b7d1, #96ceb4, #feca57)';
    setInput(example);
    parseGradient(example);
  };

  const presetGradients = [
    {
      name: 'Sunset',
      css: 'linear-gradient(45deg, #ff9a9e 0%, #fecfef 50%, #fecfef 100%)'
    },
    {
      name: 'Ocean',
      css: 'linear-gradient(120deg, #a8edea 0%, #fed6e3 100%)'
    },
    {
      name: 'Purple Bliss',
      css: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    },
    {
      name: 'Fire',
      css: 'linear-gradient(45deg, #ff9a56 0%, #ff6b95 100%)'
    },
    {
      name: 'Cool Sky',
      css: 'linear-gradient(135deg, #74b9ff 0%, #0984e3 100%)'
    },
    {
      name: 'Emerald',
      css: 'linear-gradient(120deg, #84fab0 0%, #8fd3f4 100%)'
    },
    {
      name: 'Radial Burst',
      css: 'radial-gradient(circle, #ff6b6b, #4ecdc4, #45b7d1)'
    },
    {
      name: 'Conic Rainbow',
      css: 'conic-gradient(from 0deg, #ff0000, #ff8000, #ffff00, #80ff00, #00ff00, #00ff80, #00ffff, #0080ff, #0000ff, #8000ff, #ff00ff, #ff0080, #ff0000)'
    }
  ];

  const generateRandomGradient = () => {
    const colors = [
      '#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57',
      '#ff9ff3', '#54a0ff', '#5f27cd', '#00d2d3', '#ff9f43',
      '#10ac84', '#ee5253', '#0abde3', '#3742fa', '#2f3542'
    ];
    
    const randomColors = [];
    const numColors = Math.floor(Math.random() * 3) + 2; // 2-4 colors
    
    for (let i = 0; i < numColors; i++) {
      randomColors.push(colors[Math.floor(Math.random() * colors.length)]);
    }
    
    const directions = ['45deg', '90deg', '135deg', '180deg', '225deg', '270deg', 'to right', 'to bottom', 'to top right'];
    const direction = directions[Math.floor(Math.random() * directions.length)];
    
    const gradient = `linear-gradient(${direction}, ${randomColors.join(', ')})`;
    setInput(gradient);
    parseGradient(gradient);
  };

  const extractColors = (gradientCss: string): string[] => {
    const colorRegex = /#[0-9a-fA-F]{6}|#[0-9a-fA-F]{3}|rgb\([^)]+\)|rgba\([^)]+\)|hsl\([^)]+\)|hsla\([^)]+\)|\b(?:red|green|blue|yellow|orange|purple|pink|brown|black|white|gray|grey|cyan|magenta|lime|navy|teal|silver|gold|indigo|violet|turquoise|coral|salmon|khaki|plum|orchid|tan|beige|ivory|azure|lavender|crimson|maroon|olive|aqua|fuchsia)\b/gi;
    return gradientCss.match(colorRegex) || [];
  };

  const colors = isValid ? extractColors(input) : [];

  return (
    <div className="space-y-6">
      <ToolLayout>
        <InputBox
          title="CSS Gradient"
          value={input}
          onChange={handleInputChange}
          placeholder="Enter CSS gradient (e.g., linear-gradient(45deg, #ff6b6b, #4ecdc4))..."
          rows={4}
          example="Load example gradient"
          onExample={handleExample}
        />
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Preview</h3>
            <div className="flex gap-2">
              <Button onClick={generateRandomGradient} size="sm" variant="outline">
                <IconRefresh className="h-4 w-4 mr-2" />
                Random
              </Button>
              {isValid && <CopyButton text={input} />}
            </div>
          </div>

          {/* Gradient Preview */}
          <Card>
            <CardContent className="pt-6">
              <div
                className="w-full h-48 rounded-lg border-2 border-border flex items-center justify-center"
                style={gradientStyle}
              >
                {!isValid && (
                  <div className="text-center text-muted-foreground">
                    <div className="text-lg mb-2">🎨</div>
                    <p>{error || 'Enter a CSS gradient to preview'}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Color Palette */}
          {colors.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Color Palette</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {colors.map((color, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div
                        className="w-8 h-8 rounded border-2 border-border"
                        style={{ backgroundColor: color }}
                      />
                      <span className="font-mono text-sm">{color}</span>
                      <CopyButton text={color} />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* CSS Output */}
          {isValid && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">CSS Code</CardTitle>
                  <CopyButton text={`background: ${input};`} />
                </div>
              </CardHeader>
              <CardContent>
                <pre className="bg-muted p-3 rounded font-mono text-sm overflow-x-auto">
                  {`background: ${input};`}
                </pre>
              </CardContent>
            </Card>
          )}
        </div>
      </ToolLayout>

      {/* Preset Gradients */}
      <Card>
        <CardHeader>
          <CardTitle>Preset Gradients</CardTitle>
          <CardDescription>Click any gradient to use it</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {presetGradients.map((preset, index) => (
              <div
                key={index}
                className="cursor-pointer hover:scale-105 transition-transform"
                onClick={() => {
                  setInput(preset.css);
                  parseGradient(preset.css);
                }}
              >
                <div
                  className="w-full h-20 rounded border-2 border-border"
                  style={{ background: preset.css }}
                />
                <div className="text-center mt-2">
                  <div className="text-sm font-semibold">{preset.name}</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Documentation */}
      <Card>
        <CardHeader>
          <CardTitle>CSS Gradient Previewer Guide</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-semibold mb-2">Supported gradient types:</h4>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
              <li><strong>Linear:</strong> linear-gradient(direction, color1, color2, ...)</li>
              <li><strong>Radial:</strong> radial-gradient(shape, color1, color2, ...)</li>
              <li><strong>Conic:</strong> conic-gradient(from angle, color1, color2, ...)</li>
              <li><strong>Repeating:</strong> repeating-linear-gradient(), repeating-radial-gradient()</li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-2">Direction examples:</h4>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
              <li><strong>Angles:</strong> 45deg, 90deg, 180deg</li>
              <li><strong>Keywords:</strong> to right, to bottom, to top left</li>
              <li><strong>Default:</strong> to bottom (180deg)</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-2">Color formats:</h4>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
              <li><strong>Hex:</strong> #ff6b6b, #f00</li>
              <li><strong>RGB:</strong> rgb(255, 107, 107)</li>
              <li><strong>RGBA:</strong> rgba(255, 107, 107, 0.8)</li>
              <li><strong>HSL:</strong> hsl(0, 100%, 71%)</li>
              <li><strong>Named:</strong> red, blue, transparent</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-2">Example gradients:</h4>
            <div className="space-y-2 text-sm font-mono">
              <div>linear-gradient(45deg, #ff6b6b, #4ecdc4)</div>
              <div>radial-gradient(circle, #ff6b6b, #4ecdc4)</div>
              <div>conic-gradient(from 0deg, red, yellow, green, blue)</div>
              <div>linear-gradient(to right, #ff6b6b 0%, #4ecdc4 100%)</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}