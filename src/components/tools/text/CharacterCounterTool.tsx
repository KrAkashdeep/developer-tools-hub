'use client';

import { useState, useMemo } from 'react';
import ToolLayout from '@/components/common/ToolLayout';
import InputBox from '@/components/common/InputBox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

interface CharacterStats {
  total: number;
  withoutSpaces: number;
  letters: number;
  numbers: number;
  symbols: number;
  spaces: number;
  newlines: number;
  uppercase: number;
  lowercase: number;
}

export default function CharacterCounterTool() {
  const [input, setInput] = useState('');

  const stats = useMemo((): CharacterStats => {
    if (!input) {
      return {
        total: 0,
        withoutSpaces: 0,
        letters: 0,
        numbers: 0,
        symbols: 0,
        spaces: 0,
        newlines: 0,
        uppercase: 0,
        lowercase: 0
      };
    }

    const total = input.length;
    const withoutSpaces = input.replace(/\s/g, '').length;
    const letters = (input.match(/[a-zA-Z]/g) || []).length;
    const numbers = (input.match(/[0-9]/g) || []).length;
    const spaces = (input.match(/ /g) || []).length;
    const newlines = (input.match(/\n/g) || []).length;
    const uppercase = (input.match(/[A-Z]/g) || []).length;
    const lowercase = (input.match(/[a-z]/g) || []).length;
    const symbols = total - letters - numbers - spaces - newlines;

    return {
      total,
      withoutSpaces,
      letters,
      numbers,
      symbols,
      spaces,
      newlines,
      uppercase,
      lowercase
    };
  }, [input]);

  const handleExample = () => {
    const example = `Hello World! 123
This is a sample text with UPPERCASE, lowercase, numbers (456), and symbols: @#$%^&*()
Testing character counting functionality.`;
    setInput(example);
  };

  // Common character limits for reference
  const limits = [
    { name: 'Twitter', limit: 280, color: 'bg-blue-500' },
    { name: 'SMS', limit: 160, color: 'bg-green-500' },
    { name: 'Meta Description', limit: 160, color: 'bg-purple-500' },
    { name: 'Instagram Caption', limit: 2200, color: 'bg-pink-500' },
  ];

  return (
    <div className="space-y-6">
      <ToolLayout>
        <InputBox
          title="Text to Analyze"
          value={input}
          onChange={setInput}
          placeholder="Enter or paste your text here to count characters..."
          rows={12}
          example="Load sample text"
          onExample={handleExample}
        />
        
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Character Analysis</h3>
          
          {/* Main Stats */}
          <div className="grid grid-cols-2 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="text-3xl font-bold text-primary">{stats.total.toLocaleString()}</div>
                <p className="text-sm text-muted-foreground">Total Characters</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="text-3xl font-bold text-primary">{stats.withoutSpaces.toLocaleString()}</div>
                <p className="text-sm text-muted-foreground">Without Spaces</p>
              </CardContent>
            </Card>
          </div>

          {/* Detailed Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Character Breakdown</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                <div className="flex justify-between">
                  <span>Letters:</span>
                  <Badge variant="outline">{stats.letters}</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Numbers:</span>
                  <Badge variant="outline">{stats.numbers}</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Symbols:</span>
                  <Badge variant="outline">{stats.symbols}</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Spaces:</span>
                  <Badge variant="outline">{stats.spaces}</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Line breaks:</span>
                  <Badge variant="outline">{stats.newlines}</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Total:</span>
                  <Badge variant="secondary">{stats.total}</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Case Analysis */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Case Analysis</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex justify-between">
                  <span>Uppercase:</span>
                  <Badge variant="outline">{stats.uppercase}</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Lowercase:</span>
                  <Badge variant="outline">{stats.lowercase}</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Platform Limits */}
          {stats.total > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Platform Character Limits</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {limits.map((platform, index) => {
                  const percentage = Math.min((stats.total / platform.limit) * 100, 100);
                  const isOverLimit = stats.total > platform.limit;
                  
                  return (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">{platform.name}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-sm">{stats.total}/{platform.limit}</span>
                          {isOverLimit && <Badge variant="destructive">Over limit</Badge>}
                        </div>
                      </div>
                      <Progress 
                        value={percentage} 
                        className={`h-2 ${isOverLimit ? 'bg-red-100' : ''}`}
                      />
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          )}
        </div>
      </ToolLayout>

      {/* Documentation */}
      <Card>
        <CardHeader>
          <CardTitle>Character Counter Guide</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-semibold mb-2">What it analyzes:</h4>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
              <li>Total character count (including spaces and special characters)</li>
              <li>Character count without spaces</li>
              <li>Breakdown by letters, numbers, symbols, and whitespace</li>
              <li>Case analysis (uppercase vs lowercase letters)</li>
              <li>Platform-specific character limit comparisons</li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-2">Use cases:</h4>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
              <li>Social media post optimization (Twitter, Instagram)</li>
              <li>SMS message length checking</li>
              <li>Meta description optimization for SEO</li>
              <li>Form field validation</li>
              <li>Content length analysis</li>
              <li>Academic writing requirements</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-2">Platform limits:</h4>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
              <li><strong>Twitter:</strong> 280 characters per tweet</li>
              <li><strong>SMS:</strong> 160 characters per message</li>
              <li><strong>Meta Description:</strong> ~160 characters for SEO</li>
              <li><strong>Instagram:</strong> 2,200 characters for captions</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}