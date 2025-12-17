'use client';

import { useState } from 'react';
import ToolLayout from '@/components/common/ToolLayout';
import InputBox from '@/components/common/InputBox';
import OutputBox from '@/components/common/OutputBox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import CollapsibleGuide from '@/components/common/CollapsibleGuide';

export default function JsonToCsvTool() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [delimiter, setDelimiter] = useState(',');

  const convertJsonToCsv = (jsonText: string) => {
    if (!jsonText.trim()) {
      setOutput('');
      return;
    }

    try {
      const data = JSON.parse(jsonText);
      
      if (!Array.isArray(data)) {
        setOutput('Error: JSON must be an array of objects');
        return;
      }

      if (data.length === 0) {
        setOutput('');
        return;
      }

      // Get all unique keys from all objects
      const allKeys = new Set<string>();
      data.forEach(item => {
        if (typeof item === 'object' && item !== null) {
          Object.keys(item).forEach(key => allKeys.add(key));
        }
      });

      const headers = Array.from(allKeys);
      
      // Escape CSV field if needed
      const escapeCSVField = (field: any): string => {
        if (field === null || field === undefined) {
          return '';
        }
        
        let str = String(field);
        
        // If field contains delimiter, quotes, or newlines, wrap in quotes
        if (str.includes(delimiter) || str.includes('"') || str.includes('\n') || str.includes('\r')) {
          // Escape existing quotes by doubling them
          str = str.replace(/"/g, '""');
          str = `"${str}"`;
        }
        
        return str;
      };

      // Create CSV content
      const csvLines: string[] = [];
      
      // Add headers
      csvLines.push(headers.map(header => escapeCSVField(header)).join(delimiter));
      
      // Add data rows
      data.forEach(item => {
        if (typeof item === 'object' && item !== null) {
          const row = headers.map(header => {
            const value = item[header];
            return escapeCSVField(value);
          });
          csvLines.push(row.join(delimiter));
        }
      });

      setOutput(csvLines.join('\n'));
    } catch (error) {
      setOutput(`Error converting JSON to CSV: ${error instanceof Error ? error.message : 'Invalid JSON format'}`);
    }
  };

  const handleInputChange = (value: string) => {
    setInput(value);
    convertJsonToCsv(value);
  };

  const handleExample = () => {
    const example = `[
  {
    "name": "John Doe",
    "age": 30,
    "city": "New York",
    "country": "USA",
    "email": "john@example.com"
  },
  {
    "name": "Jane Smith",
    "age": 25,
    "city": "London",
    "country": "UK",
    "email": "jane@example.com"
  },
  {
    "name": "Bob Johnson",
    "age": 35,
    "city": "Toronto",
    "country": "Canada",
    "email": "bob@example.com"
  },
  {
    "name": "Alice Brown",
    "age": 28,
    "city": "Sydney",
    "country": "Australia",
    "email": "alice@example.com"
  }
]`;
    setInput(example);
    convertJsonToCsv(example);
  };

  return (
    <div className="space-y-6">
      <ToolLayout>
        <InputBox
          title="JSON Data"
          value={input}
          onChange={handleInputChange}
          placeholder="Paste your JSON array here..."
          rows={12}
          example="Load example JSON"
          onExample={handleExample}
        />
        
        <OutputBox
          title="CSV Output"
          value={output}
          placeholder="CSV output will appear here..."
          rows={10}
        />
      </ToolLayout>

      {/* CSV Settings */}
      <Card>
        <CardHeader>
          <CardTitle>CSV Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <div>
            <Label htmlFor="delimiter">Delimiter</Label>
            <select
              id="delimiter"
              value={delimiter}
              onChange={(e) => {
                setDelimiter(e.target.value);
                convertJsonToCsv(input);
              }}
              className="w-full mt-2 px-3 py-2 border rounded"
            >
              <option value=",">Comma (,)</option>
              <option value=";">Semicolon (;)</option>
              <option value="\t">Tab</option>
              <option value="|">Pipe (|)</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Documentation */}
      <CollapsibleGuide title="JSON to CSV Converter Guide">
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold mb-2">Requirements:</h4>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
              <li>JSON must be an array of objects</li>
              <li>Each object represents a row in the CSV</li>
              <li>Object keys become CSV column headers</li>
              <li>Missing properties in objects result in empty CSV cells</li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-2">Features:</h4>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
              <li>Supports multiple delimiters (comma, semicolon, tab, pipe)</li>
              <li>Automatically escapes fields containing delimiters or quotes</li>
              <li>Handles null and undefined values</li>
              <li>Collects all unique keys from all objects as headers</li>
              <li>Proper CSV formatting with RFC 4180 compliance</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-2">Example JSON Input:</h4>
            <pre className="bg-muted p-3 rounded text-sm font-mono">
{`[
  {
    "name": "John Doe",
    "age": 30,
    "city": "New York"
  },
  {
    "name": "Jane Smith",
    "age": 25,
    "city": "London"
  }
]`}
            </pre>
          </div>

          <div>
            <h4 className="font-semibold mb-2">Resulting CSV:</h4>
            <pre className="bg-muted p-3 rounded text-sm font-mono">
{`name,age,city
John Doe,30,New York
Jane Smith,25,London`}
            </pre>
          </div>

          <div>
            <h4 className="font-semibold mb-2">Limitations:</h4>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
              <li>Nested objects are converted to strings</li>
              <li>Arrays are converted to strings</li>
              <li>Only works with flat object structures for best results</li>
            </ul>
          </div>
        </div>
      </CollapsibleGuide>
    </div>
  );
}