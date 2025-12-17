'use client';

import { useState } from 'react';
import ToolLayout from '@/components/common/ToolLayout';
import InputBox from '@/components/common/InputBox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import CollapsibleGuide from '@/components/common/CollapsibleGuide';

export default function JsonToFileTool() {
  const [input, setInput] = useState('');
  const [filename, setFilename] = useState('data.json');
  const [prettyFormat, setPrettyFormat] = useState(true);
  const [isValidJson, setIsValidJson] = useState(false);
  const [jsonStats, setJsonStats] = useState({ size: 0, keys: 0, type: '' });

  const validateAndAnalyzeJson = (jsonText: string) => {
    if (!jsonText.trim()) {
      setIsValidJson(false);
      setJsonStats({ size: 0, keys: 0, type: '' });
      return;
    }

    try {
      const parsed = JSON.parse(jsonText);
      setIsValidJson(true);
      
      const size = new Blob([jsonText]).size;
      let keys = 0;
      let type = '';

      if (Array.isArray(parsed)) {
        type = 'Array';
        keys = parsed.length;
      } else if (typeof parsed === 'object' && parsed !== null) {
        type = 'Object';
        keys = Object.keys(parsed).length;
      } else {
        type = typeof parsed;
        keys = 0;
      }

      setJsonStats({ size, keys, type });
    } catch (error) {
      setIsValidJson(false);
      setJsonStats({ size: 0, keys: 0, type: '' });
    }
  };

  const handleInputChange = (value: string) => {
    setInput(value);
    validateAndAnalyzeJson(value);
  };

  const downloadJson = () => {
    if (!input.trim() || !isValidJson) {
      alert('Please enter valid JSON data');
      return;
    }

    try {
      let jsonContent = input;
      
      if (prettyFormat) {
        const parsed = JSON.parse(input);
        jsonContent = JSON.stringify(parsed, null, 2);
      }

      const blob = new Blob([jsonContent], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = filename.endsWith('.json') ? filename : `${filename}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      URL.revokeObjectURL(url);
    } catch (error) {
      alert('Error creating file: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  };

  const handleExample = () => {
    const example = `{
  "users": [
    {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "active": true,
      "roles": ["admin", "user"]
    },
    {
      "id": 2,
      "name": "Jane Smith",
      "email": "jane@example.com",
      "active": false,
      "roles": ["user"]
    }
  ],
  "metadata": {
    "total": 2,
    "created": "2025-12-11T10:30:00Z",
    "version": "1.0"
  }
}`;
    setInput(example);
    validateAndAnalyzeJson(example);
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Download Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="filename">Filename</Label>
            <Input
              id="filename"
              value={filename}
              onChange={(e) => setFilename(e.target.value)}
              placeholder="data.json"
              className="mt-2"
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox
              id="prettyFormat"
              checked={prettyFormat}
              onCheckedChange={(checked) => setPrettyFormat(checked as boolean)}
            />
            <Label htmlFor="prettyFormat">Pretty format (indented)</Label>
          </div>
        </CardContent>
      </Card>

      <ToolLayout>
        <InputBox
          title="JSON Data"
          value={input}
          onChange={handleInputChange}
          placeholder="Enter or paste your JSON data here..."
          rows={15}
          example="Load example JSON"
          onExample={handleExample}
        />
        
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-semibold">File Preview</h3>
            <Badge variant={isValidJson ? 'secondary' : 'destructive'}>
              {isValidJson ? 'Valid JSON' : 'Invalid JSON'}
            </Badge>
          </div>

          {isValidJson && (
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex justify-between">
                      <span>Type:</span>
                      <Badge variant="outline">{jsonStats.type}</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Size:</span>
                      <Badge variant="outline">{formatFileSize(jsonStats.size)}</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>{jsonStats.type === 'Array' ? 'Items:' : 'Keys:'}:</span>
                      <Badge variant="outline">{jsonStats.keys}</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Format:</span>
                      <Badge variant="outline">{prettyFormat ? 'Pretty' : 'Minified'}</Badge>
                    </div>
                  </div>
                  
                  <Button 
                    onClick={downloadJson} 
                    className="w-full"
                    disabled={!isValidJson}
                  >
                    Download JSON File
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {!isValidJson && input.trim() && (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center text-destructive">
                  <p className="font-semibold">Invalid JSON</p>
                  <p className="text-sm">Please check your JSON syntax</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </ToolLayout>

      {/* Documentation */}
      <CollapsibleGuide title="JSON to File Tool Guide">
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold mb-2">Features:</h4>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
              <li>Validates JSON syntax before download</li>
              <li>Pretty formatting option for readable output</li>
              <li>Custom filename support</li>
              <li>File size and structure analysis</li>
              <li>Automatic .json extension</li>
              <li>Browser-based download (no server required)</li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-2">Use cases:</h4>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
              <li>Save API responses as JSON files</li>
              <li>Export configuration data</li>
              <li>Create backup files from web applications</li>
              <li>Download formatted JSON for sharing</li>
              <li>Convert inline JSON to downloadable files</li>
              <li>Archive JSON data for later use</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-2">JSON validation:</h4>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
              <li>Checks for proper JSON syntax</li>
              <li>Identifies data type (Object, Array, etc.)</li>
              <li>Counts keys/items in the data</li>
              <li>Calculates file size</li>
              <li>Prevents download of invalid JSON</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-2">Tips:</h4>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
              <li>Use pretty format for human-readable files</li>
              <li>Minified format creates smaller files</li>
              <li>Include descriptive filenames for organization</li>
              <li>Validate JSON before sharing with others</li>
            </ul>
          </div>
        </div>
      </CollapsibleGuide>
    </div>
  );
}