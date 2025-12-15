'use client';

import { useState } from 'react';
import ToolLayout from '@/components/common/ToolLayout';
import InputBox from '@/components/common/InputBox';
import OutputBox from '@/components/common/OutputBox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';

export default function RemoveSpacesTool() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [removeExtraSpaces, setRemoveExtraSpaces] = useState(true);
  const [removeLeadingSpaces, setRemoveLeadingSpaces] = useState(true);
  const [removeTrailingSpaces, setRemoveTrailingSpaces] = useState(true);
  const [removeAllSpaces, setRemoveAllSpaces] = useState(false);
  const [removeEmptyLines, setRemoveEmptyLines] = useState(false);
  const [stats, setStats] = useState({ original: 0, cleaned: 0, removed: 0 });

  const processText = (text: string) => {
    if (!text) {
      setOutput('');
      setStats({ original: 0, cleaned: 0, removed: 0 });
      return;
    }

    let result = text;
    const originalLength = text.length;

    // Remove all spaces if option is selected
    if (removeAllSpaces) {
      result = result.replace(/\s/g, '');
    } else {
      // Remove extra spaces (multiple spaces become single space)
      if (removeExtraSpaces) {
        result = result.replace(/[ \t]+/g, ' ');
      }

      // Remove leading spaces from each line
      if (removeLeadingSpaces) {
        result = result.replace(/^[ \t]+/gm, '');
      }

      // Remove trailing spaces from each line
      if (removeTrailingSpaces) {
        result = result.replace(/[ \t]+$/gm, '');
      }

      // Remove empty lines
      if (removeEmptyLines) {
        result = result.replace(/^\s*\n/gm, '');
      }
    }

    const cleanedLength = result.length;
    const removedCount = originalLength - cleanedLength;

    setOutput(result);
    setStats({
      original: originalLength,
      cleaned: cleanedLength,
      removed: removedCount
    });
  };

  const handleInputChange = (value: string) => {
    setInput(value);
    processText(value);
  };

  const handleOptionChange = (option: string, checked: boolean) => {
    switch (option) {
      case 'extraSpaces':
        setRemoveExtraSpaces(checked);
        break;
      case 'leadingSpaces':
        setRemoveLeadingSpaces(checked);
        break;
      case 'trailingSpaces':
        setRemoveTrailingSpaces(checked);
        break;
      case 'allSpaces':
        setRemoveAllSpaces(checked);
        // If removing all spaces, disable other options
        if (checked) {
          setRemoveExtraSpaces(false);
          setRemoveLeadingSpaces(false);
          setRemoveTrailingSpaces(false);
        }
        break;
      case 'emptyLines':
        setRemoveEmptyLines(checked);
        break;
    }
    
    // Apply changes immediately
    setTimeout(() => processText(input), 0);
  };

  const handleExample = () => {
    const example = `   This text has    extra spaces.   
  
    Leading and trailing spaces on this line.    

Multiple     spaces    between    words.

    Empty lines above and below.    

Final line with trailing spaces.   `;
    setInput(example);
    processText(example);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Whitespace Removal Options</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="removeExtraSpaces"
                  checked={removeExtraSpaces && !removeAllSpaces}
                  disabled={removeAllSpaces}
                  onCheckedChange={(checked) => handleOptionChange('extraSpaces', checked as boolean)}
                />
                <Label htmlFor="removeExtraSpaces">Remove extra spaces</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="removeLeadingSpaces"
                  checked={removeLeadingSpaces && !removeAllSpaces}
                  disabled={removeAllSpaces}
                  onCheckedChange={(checked) => handleOptionChange('leadingSpaces', checked as boolean)}
                />
                <Label htmlFor="removeLeadingSpaces">Remove leading spaces</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="removeTrailingSpaces"
                  checked={removeTrailingSpaces && !removeAllSpaces}
                  disabled={removeAllSpaces}
                  onCheckedChange={(checked) => handleOptionChange('trailingSpaces', checked as boolean)}
                />
                <Label htmlFor="removeTrailingSpaces">Remove trailing spaces</Label>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="removeAllSpaces"
                  checked={removeAllSpaces}
                  onCheckedChange={(checked) => handleOptionChange('allSpaces', checked as boolean)}
                />
                <Label htmlFor="removeAllSpaces">Remove ALL spaces</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="removeEmptyLines"
                  checked={removeEmptyLines}
                  onCheckedChange={(checked) => handleOptionChange('emptyLines', checked as boolean)}
                />
                <Label htmlFor="removeEmptyLines">Remove empty lines</Label>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <ToolLayout>
        <InputBox
          title="Text with Extra Spaces"
          value={input}
          onChange={handleInputChange}
          placeholder="Enter text with extra whitespace..."
          rows={10}
          example="Load example text"
          onExample={handleExample}
        />
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-semibold">Cleaned Text</h3>
            {stats.removed > 0 && (
              <Badge variant="secondary">{stats.removed} characters removed</Badge>
            )}
          </div>
          <OutputBox
            title="Result"
            value={output}
            placeholder="Cleaned text will appear here..."
            rows={10}
          />
          
          {stats.original > 0 && (
            <div className="flex gap-2 flex-wrap">
              <Badge variant="outline">Original: {stats.original} chars</Badge>
              <Badge variant="outline">Cleaned: {stats.cleaned} chars</Badge>
              <Badge variant="secondary">Removed: {stats.removed} chars</Badge>
            </div>
          )}
        </div>
      </ToolLayout>

      {/* Documentation */}
      <Card>
        <CardHeader>
          <CardTitle>Remove Spaces Tool Guide</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-semibold mb-2">Whitespace removal options:</h4>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
              <li><strong>Extra spaces:</strong> Converts multiple consecutive spaces to single spaces</li>
              <li><strong>Leading spaces:</strong> Removes spaces at the beginning of each line</li>
              <li><strong>Trailing spaces:</strong> Removes spaces at the end of each line</li>
              <li><strong>All spaces:</strong> Removes every space character (overrides other options)</li>
              <li><strong>Empty lines:</strong> Removes completely empty lines</li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-2">Use cases:</h4>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
              <li>Clean up copied text from PDFs or websites</li>
              <li>Format code or data for processing</li>
              <li>Prepare text for databases or APIs</li>
              <li>Remove formatting artifacts from documents</li>
              <li>Standardize whitespace in content</li>
              <li>Optimize text for character limits</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-2">Tips:</h4>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
              <li>Use "Remove extra spaces" for general text cleanup</li>
              <li>Enable "Remove all spaces" for creating hashtags or IDs</li>
              <li>Combine options for comprehensive text cleaning</li>
              <li>Check the character count to see how much was removed</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}