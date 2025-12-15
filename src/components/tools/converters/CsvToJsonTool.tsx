'use client';

import { useState } from 'react';
import ToolLayout from '@/components/common/ToolLayout';
import InputBox from '@/components/common/InputBox';
import OutputBox from '@/components/common/OutputBox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';

export default function CsvToJsonTool() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [hasHeaders, setHasHeaders] = useState(true);
  const [delimiter, setDelimiter] = useState(',');

  const convertCsvToJson = (csvText: string) => {
    if (!csvText.trim()) {
      setOutput('');
      return;
    }

    try {
      const lines = csvText.trim().split('\n');
      if (lines.length === 0) {
        setOutput('');
        return;
      }

      // Parse CSV with custom delimiter
      const parseCSVLine = (line: string): string[] => {
        const result: string[] = [];
        let current = '';
        let inQuotes = false;
        
        for (let i = 0; i < line.length; i++) {
          const char = line[i];
          
          if (char === '"') {
            if (inQuotes && line[i + 1] === '"') {
              current += '"';
              i++; // Skip next quote
            } else {
              inQuotes = !inQuotes;
            }
          } else if (char === delimiter && !inQuotes) {
            result.push(current.trim());
            current = '';
          } else {
            current += char;
          }
        }
        
        result.push(current.trim());
        return result;
      };

      let headers: string[] = [];
      let dataLines: string[] = [];

      if (hasHeaders) {
        headers = parseCSVLine(lines[0]);
        dataLines = lines.slice(1);
      } else {
        // Generate generic headers
        const firstLine = parseCSVLine(lines[0]);
        headers = firstLine.map((_, index) => `column_${index + 1}`);
        dataLines = lines;
      }

      const jsonArray = dataLines
        .filter(line => line.trim()) // Remove empty lines
        .map(line => {
          const values = parseCSVLine(line);
          const obj: { [key: string]: string } = {};
          
          headers.forEach((header, index) => {
            const value = values[index] || '';
            // Try to parse as number if it looks like one
            const cleanHeader = header.replace(/"/g, '').trim();
            const cleanValue = value.replace(/"/g, '').trim();
            
            // Check if value is a number
            if (cleanValue && !isNaN(Number(cleanValue)) && cleanValue !== '') {
              (obj as any)[cleanHeader] = Number(cleanValue);
            } else {
              (obj as any)[cleanHeader] = cleanValue;
            }
          });
          
          return obj;
        });

      setOutput(JSON.stringify(jsonArray, null, 2));
    } catch (error) {
      setOutput(`Error converting CSV to JSON: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleInputChange = (value: string) => {
    setInput(value);
    convertCsvToJson(value);
  };

  const handleExample = () => {
    const example = `name,age,city,country
John Doe,30,New York,USA
Jane Smith,25,London,UK
Bob Johnson,35,Toronto,Canada
Alice Brown,28,Sydney,Australia`;
    setInput(example);
    convertCsvToJson(example);
  };

  return (
    <div className="space-y-6">
      <ToolLayout>
        <InputBox
          title="CSV Data"
          value={input}
          onChange={handleInputChange}
          placeholder="Paste your CSV data here..."
          rows={10}
          example="Load example CSV"
          onExample={handleExample}
        />
        
        <OutputBox
          title="JSON Output"
          value={output}
          placeholder="JSON output will appear here..."
          rows={15}
        />
      </ToolLayout>

      {/* CSV Settings */}
      <Card>
        <CardHeader>
          <CardTitle>CSV Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="headers"
              checked={hasHeaders}
              onCheckedChange={(checked) => {
                setHasHeaders(checked as boolean);
                convertCsvToJson(input);
              }}
            />
            <Label htmlFor="headers">First row contains headers</Label>
          </div>
          
          <div>
            <Label htmlFor="delimiter">Delimiter</Label>
            <select
              id="delimiter"
              value={delimiter}
              onChange={(e) => {
                setDelimiter(e.target.value);
                convertCsvToJson(input);
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
      <Card>
        <CardHeader>
          <CardTitle>CSV to JSON Converter Guide</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-semibold mb-2">Features:</h4>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
              <li>Supports multiple delimiters (comma, semicolon, tab, pipe)</li>
              <li>Handles quoted fields with embedded delimiters</li>
              <li>Option to treat first row as headers</li>
              <li>Automatic number detection and conversion</li>
              <li>Handles escaped quotes in CSV fields</li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-2">CSV Format Rules:</h4>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
              <li>Fields containing delimiters must be quoted</li>
              <li>Fields containing quotes must escape them with double quotes</li>
              <li>Empty lines are ignored</li>
              <li>Numeric values are automatically converted to numbers</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-2">Example CSV:</h4>
            <pre className="bg-muted p-3 rounded text-sm font-mono">
{`name,age,city,country
"John Doe",30,"New York",USA
"Jane Smith",25,London,UK`}
            </pre>
          </div>

          <div>
            <h4 className="font-semibold mb-2">Resulting JSON:</h4>
            <pre className="bg-muted p-3 rounded text-sm font-mono">
{`[
  {
    "name": "John Doe",
    "age": 30,
    "city": "New York",
    "country": "USA"
  },
  {
    "name": "Jane Smith",
    "age": 25,
    "city": "London",
    "country": "UK"
  }
]`}
            </pre>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}