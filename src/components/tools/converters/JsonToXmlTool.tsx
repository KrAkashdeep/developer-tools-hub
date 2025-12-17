'use client';

import { useState } from 'react';
import ToolLayout from '@/components/common/ToolLayout';
import InputBox from '@/components/common/InputBox';
import OutputBox from '@/components/common/OutputBox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import CollapsibleGuide from '@/components/common/CollapsibleGuide';

export default function JsonToXmlTool() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [rootElement, setRootElement] = useState('root');
  const [prettyFormat, setPrettyFormat] = useState(true);
  const [includeDeclaration, setIncludeDeclaration] = useState(true);

  const convertJsonToXml = (jsonText: string) => {
    if (!jsonText.trim()) {
      setOutput('');
      return;
    }

    try {
      const data = JSON.parse(jsonText);
      
      const escapeXml = (str: string): string => {
        return str
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/"/g, '&quot;')
          .replace(/'/g, '&apos;');
      };

      const isValidXmlName = (name: string): boolean => {
        // XML element names must start with letter or underscore
        // and contain only letters, digits, hyphens, periods, and underscores
        return /^[a-zA-Z_][a-zA-Z0-9_.-]*$/.test(name);
      };

      const sanitizeElementName = (name: string): string => {
        // Replace invalid characters with underscores
        let sanitized = name.replace(/[^a-zA-Z0-9_.-]/g, '_');
        
        // Ensure it starts with a letter or underscore
        if (!/^[a-zA-Z_]/.test(sanitized)) {
          sanitized = '_' + sanitized;
        }
        
        return sanitized || 'element';
      };

      const convertValue = (value: any, key: string, depth: number = 0): string => {
        const indent = prettyFormat ? '  '.repeat(depth) : '';
        const newline = prettyFormat ? '\n' : '';
        const elementName = sanitizeElementName(key);

        if (value === null || value === undefined) {
          return `${indent}<${elementName}></${elementName}>${newline}`;
        }

        if (typeof value === 'string') {
          return `${indent}<${elementName}>${escapeXml(value)}</${elementName}>${newline}`;
        }

        if (typeof value === 'number' || typeof value === 'boolean') {
          return `${indent}<${elementName}>${value}</${elementName}>${newline}`;
        }

        if (Array.isArray(value)) {
          if (value.length === 0) {
            return `${indent}<${elementName}></${elementName}>${newline}`;
          }

          let result = '';
          value.forEach((item, index) => {
            if (typeof item === 'object' && item !== null) {
              result += `${indent}<${elementName}>${newline}`;
              Object.entries(item).forEach(([k, v]) => {
                result += convertValue(v, k, depth + 1);
              });
              result += `${indent}</${elementName}>${newline}`;
            } else {
              result += convertValue(item, elementName, depth);
            }
          });
          return result;
        }

        if (typeof value === 'object') {
          const entries = Object.entries(value);
          if (entries.length === 0) {
            return `${indent}<${elementName}></${elementName}>${newline}`;
          }

          let result = `${indent}<${elementName}>${newline}`;
          entries.forEach(([k, v]) => {
            result += convertValue(v, k, depth + 1);
          });
          result += `${indent}</${elementName}>${newline}`;
          return result;
        }

        return `${indent}<${elementName}>${escapeXml(String(value))}</${elementName}>${newline}`;
      };

      let xmlContent = '';

      if (includeDeclaration) {
        xmlContent += '<?xml version="1.0" encoding="UTF-8"?>\n';
      }

      if (Array.isArray(data)) {
        // Handle array at root level
        xmlContent += `<${rootElement}>${prettyFormat ? '\n' : ''}`;
        data.forEach((item, index) => {
          if (typeof item === 'object' && item !== null) {
            xmlContent += convertValue(item, 'item', 1);
          } else {
            xmlContent += convertValue(item, 'item', 1);
          }
        });
        xmlContent += `</${rootElement}>`;
      } else if (typeof data === 'object' && data !== null) {
        // Handle object at root level
        const entries = Object.entries(data);
        if (entries.length === 1) {
          // Single root element
          const [key, value] = entries[0];
          xmlContent += convertValue(value, key, 0);
        } else {
          // Multiple root elements, wrap in root element
          xmlContent += `<${rootElement}>${prettyFormat ? '\n' : ''}`;
          entries.forEach(([key, value]) => {
            xmlContent += convertValue(value, key, 1);
          });
          xmlContent += `</${rootElement}>`;
        }
      } else {
        // Handle primitive at root level
        xmlContent += convertValue(data, rootElement, 0);
      }

      setOutput(xmlContent.trim());
    } catch (error) {
      setOutput(`Error converting JSON to XML: ${error instanceof Error ? error.message : 'Invalid JSON format'}`);
    }
  };

  const handleInputChange = (value: string) => {
    setInput(value);
    convertJsonToXml(value);
  };

  const handleExample = () => {
    const example = `{
  "bookstore": {
    "book": [
      {
        "id": "1",
        "title": "The Great Gatsby",
        "author": "F. Scott Fitzgerald",
        "price": 12.99,
        "category": "fiction",
        "available": true
      },
      {
        "id": "2",
        "title": "To Kill a Mockingbird",
        "author": "Harper Lee",
        "price": 14.99,
        "category": "fiction",
        "available": false
      }
    ],
    "owner": "John's Books",
    "location": "New York"
  }
}`;
    setInput(example);
    convertJsonToXml(example);
  };

  return (
    <div className="space-y-6">
      <ToolLayout>
        <InputBox
          title="JSON Data"
          value={input}
          onChange={handleInputChange}
          placeholder="Paste your JSON data here..."
          rows={12}
          example="Load example JSON"
          onExample={handleExample}
        />
        
        <OutputBox
          title="XML Output"
          value={output}
          placeholder="XML output will appear here..."
          rows={15}
        />
      </ToolLayout>

      {/* XML Settings */}
      <Card>
        <CardHeader>
          <CardTitle>XML Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="rootElement">Root Element Name</Label>
            <input
              id="rootElement"
              type="text"
              value={rootElement}
              onChange={(e) => {
                setRootElement(e.target.value || 'root');
                convertJsonToXml(input);
              }}
              className="w-full mt-2 px-3 py-2 border rounded"
              placeholder="root"
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox
              id="prettyFormat"
              checked={prettyFormat}
              onCheckedChange={(checked) => {
                setPrettyFormat(checked as boolean);
                convertJsonToXml(input);
              }}
            />
            <Label htmlFor="prettyFormat">Pretty format (indented)</Label>
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox
              id="includeDeclaration"
              checked={includeDeclaration}
              onCheckedChange={(checked) => {
                setIncludeDeclaration(checked as boolean);
                convertJsonToXml(input);
              }}
            />
            <Label htmlFor="includeDeclaration">Include XML declaration</Label>
          </div>
        </CardContent>
      </Card>

      {/* Documentation */}
      <CollapsibleGuide title="JSON to XML Converter Guide">
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold mb-2">Features:</h4>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
              <li>Converts JSON objects and arrays to XML</li>
              <li>Handles nested objects and arrays</li>
              <li>Sanitizes invalid XML element names</li>
              <li>Escapes special XML characters</li>
              <li>Configurable root element name</li>
              <li>Pretty formatting option</li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-2">Conversion Rules:</h4>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
              <li>JSON objects become XML elements</li>
              <li>JSON arrays create multiple elements with the same name</li>
              <li>JSON keys become XML element names</li>
              <li>Invalid XML characters in keys are replaced with underscores</li>
              <li>Special characters in values are escaped</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-2">Example Conversion:</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h5 className="font-semibold text-sm mb-2">JSON Input:</h5>
                <pre className="bg-muted p-3 rounded text-xs font-mono">
{`{
  "person": {
    "name": "John",
    "age": 30
  }
}`}
                </pre>
              </div>
              <div>
                <h5 className="font-semibold text-sm mb-2">XML Output:</h5>
                <pre className="bg-muted p-3 rounded text-xs font-mono">
{`<person>
  <name>John</name>
  <age>30</age>
</person>`}
                </pre>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-2">Array Handling:</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h5 className="font-semibold text-sm mb-2">JSON Array:</h5>
                <pre className="bg-muted p-3 rounded text-xs font-mono">
{`{
  "items": ["apple", "banana"]
}`}
                </pre>
              </div>
              <div>
                <h5 className="font-semibold text-sm mb-2">XML Result:</h5>
                <pre className="bg-muted p-3 rounded text-xs font-mono">
{`<root>
  <items>apple</items>
  <items>banana</items>
</root>`}
                </pre>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-2">Limitations:</h4>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
              <li>XML attributes are not supported (only elements)</li>
              <li>JSON key order may not be preserved</li>
              <li>Some JSON structures don't translate perfectly to XML</li>
              <li>Complex nested arrays may create verbose XML</li>
            </ul>
          </div>
        </div>
      </CollapsibleGuide>
    </div>
  );
}