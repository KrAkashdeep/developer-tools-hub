'use client';

import { useState } from 'react';
import ToolLayout from '@/components/common/ToolLayout';
import InputBox from '@/components/common/InputBox';
import OutputBox from '@/components/common/OutputBox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import CollapsibleGuide from '@/components/common/CollapsibleGuide';

export default function SortLinesTool() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [caseSensitive, setCaseSensitive] = useState(false);

  const sortLines = (text: string) => {
    if (!text.trim()) {
      setOutput('');
      return;
    }

    const lines = text.split('\n');
    const sorted = [...lines].sort((a, b) => {
      const strA = caseSensitive ? a : a.toLowerCase();
      const strB = caseSensitive ? b : b.toLowerCase();
      
      if (sortOrder === 'asc') {
        return strA.localeCompare(strB);
      } else {
        return strB.localeCompare(strA);
      }
    });

    setOutput(sorted.join('\n'));
  };

  const handleInputChange = (value: string) => {
    setInput(value);
    sortLines(value);
  };

  const handleSortOrderChange = (order: 'asc' | 'desc') => {
    setSortOrder(order);
    sortLines(input);
  };

  const handleCaseSensitiveChange = () => {
    setCaseSensitive(!caseSensitive);
    sortLines(input);
  };

  const handleExample = () => {
    const example = `zebra\napple\nBanana\ncherry\nDate\nfig\nGrape`;
    setInput(example);
    sortLines(example);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Sort Options</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Button
              variant={sortOrder === 'asc' ? 'default' : 'outline'}
              onClick={() => handleSortOrderChange('asc')}
            >
              Ascending (A-Z)
            </Button>
            <Button
              variant={sortOrder === 'desc' ? 'default' : 'outline'}
              onClick={() => handleSortOrderChange('desc')}
            >
              Descending (Z-A)
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="caseSensitive"
              checked={caseSensitive}
              onChange={handleCaseSensitiveChange}
            />
            <label htmlFor="caseSensitive">Case sensitive</label>
          </div>
        </CardContent>
      </Card>

      <ToolLayout>
        <InputBox
          title="Lines to Sort"
          value={input}
          onChange={handleInputChange}
          placeholder="Enter lines to sort..."
          example="Load example lines"
          onExample={handleExample}
        />
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-semibold">Sorted Lines</h3>
            <Badge variant="outline">
              {sortOrder === 'asc' ? 'A-Z' : 'Z-A'}
            </Badge>
            {caseSensitive && <Badge variant="outline">Case Sensitive</Badge>}
          </div>
          <OutputBox
            title="Result"
            value={output}
            placeholder="Sorted lines will appear here..."
          />
        </div>
      </ToolLayout>

      <CollapsibleGuide title="Sort Lines Tool Guide">
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold mb-2">What it does:</h4>
            <p className="text-sm text-muted-foreground">
              Sorts text lines alphabetically in ascending (A-Z) or descending (Z-A) order 
              with optional case sensitivity settings.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-2">Features:</h4>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
              <li>Ascending (A-Z) and descending (Z-A) sorting</li>
              <li>Case-sensitive or case-insensitive options</li>
              <li>Preserves line content and formatting</li>
              <li>Handles special characters and numbers</li>
              <li>Real-time sorting as you change options</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-2">Sorting behavior:</h4>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
              <li><strong>Case-insensitive:</strong> "apple" and "Apple" sorted together</li>
              <li><strong>Case-sensitive:</strong> Uppercase letters come before lowercase</li>
              <li><strong>Numbers:</strong> Sorted as text, not numerically</li>
              <li><strong>Special chars:</strong> Sorted by Unicode value</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-2">Use cases:</h4>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
              <li>Organize lists alphabetically</li>
              <li>Sort CSV data by first column</li>
              <li>Arrange names or items in order</li>
              <li>Organize code imports</li>
              <li>Sort configuration entries</li>
            </ul>
          </div>
        </div>
      </CollapsibleGuide>
    </div>
  );
}