'use client';

import { useState } from 'react';
import ToolLayout from '@/components/common/ToolLayout';
import InputBox from '@/components/common/InputBox';
import OutputBox from '@/components/common/OutputBox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';

export default function XmlToJsonTool() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [preserveAttributes, setPreserveAttributes] = useState(true);
  const [arrayElements, setArrayElements] = useState(true);

  const convertXmlToJson = (xmlText: string) => {
    if (!xmlText.trim()) {
      setOutput('');
      return;
    }

    try {
      // Simple XML to JSON converter
      // This is a basic implementation - for production use, consider using a proper XML parser
      
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xmlText, 'text/xml');
      
      // Check for parsing errors
      const parserError = xmlDoc.querySelector('parsererror');
      if (parserError) {
        setOutput('Error: Invalid XML format\n' + parserError.textContent);
        return;
      }

      const xmlToObject = (node: Element): any => {
        const obj: any = {};
        
        // Handle attributes
        if (preserveAttributes && node.attributes.length > 0) {
          obj['@attributes'] = {};
          for (let i = 0; i < node.attributes.length; i++) {
            const attr = node.attributes[i];
            obj['@attributes'][attr.name] = attr.value;
          }
        }
        
        // Handle child nodes
        const children = Array.from(node.children);
        const textContent = node.textContent?.trim();
        
        if (children.length === 0) {
          // Leaf node with text content
          if (textContent) {
            if (preserveAttributes && obj['@attributes']) {
              obj['#text'] = textContent;
            } else {
              return textContent;
            }
          }
          return Object.keys(obj).length > 0 ? obj : null;
        }
        
        // Group children by tag name
        const childGroups: { [key: string]: any[] } = {};
        children.forEach(child => {
          const tagName = child.tagName;
          if (!childGroups[tagName]) {
            childGroups[tagName] = [];
          }
          childGroups[tagName].push(xmlToObject(child));
        });
        
        // Convert groups to object properties
        Object.keys(childGroups).forEach(tagName => {
          const group = childGroups[tagName];
          if (arrayElements || group.length > 1) {
            obj[tagName] = group;
          } else {
            obj[tagName] = group[0];
          }
        });
        
        // Add text content if present alongside child elements
        if (textContent && children.length > 0) {
          obj['#text'] = textContent;
        }
        
        return obj;
      };

      const rootElement = xmlDoc.documentElement;
      if (!rootElement) {
        setOutput('Error: No root element found');
        return;
      }

      const result = {
        [rootElement.tagName]: xmlToObject(rootElement)
      };

      setOutput(JSON.stringify(result, null, 2));
    } catch (error) {
      setOutput(`Error converting XML to JSON: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleInputChange = (value: string) => {
    setInput(value);
    convertXmlToJson(value);
  };

  const handleExample = () => {
    const example = `<?xml version="1.0" encoding="UTF-8"?>
<bookstore>
  <book id="1" category="fiction">
    <title>The Great Gatsby</title>
    <author>F. Scott Fitzgerald</author>
    <price currency="USD">12.99</price>
    <available>true</available>
  </book>
  <book id="2" category="fiction">
    <title>To Kill a Mockingbird</title>
    <author>Harper Lee</author>
    <price currency="USD">14.99</price>
    <available>false</available>
  </book>
  <owner>John's Books</owner>
  <location>New York</location>
</bookstore>`;
    setInput(example);
    convertXmlToJson(example);
  };

  return (
    <div className="space-y-6">
      <ToolLayout>
        <InputBox
          title="XML Data"
          value={input}
          onChange={handleInputChange}
          placeholder="Paste your XML data here..."
          rows={12}
          example="Load example XML"
          onExample={handleExample}
        />
        
        <OutputBox
          title="JSON Output"
          value={output}
          placeholder="JSON output will appear here..."
          rows={15}
        />
      </ToolLayout>

      {/* Conversion Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Conversion Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="preserveAttributes"
              checked={preserveAttributes}
              onCheckedChange={(checked) => {
                setPreserveAttributes(checked as boolean);
                convertXmlToJson(input);
              }}
            />
            <Label htmlFor="preserveAttributes">Preserve XML attributes as @attributes</Label>
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox
              id="arrayElements"
              checked={arrayElements}
              onCheckedChange={(checked) => {
                setArrayElements(checked as boolean);
                convertXmlToJson(input);
              }}
            />
            <Label htmlFor="arrayElements">Always use arrays for child elements</Label>
          </div>
        </CardContent>
      </Card>

      {/* Documentation */}
      <Card>
        <CardHeader>
          <CardTitle>XML to JSON Converter Guide</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-semibold mb-2">Features:</h4>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
              <li>Converts XML elements to JSON objects</li>
              <li>Preserves XML attributes as @attributes objects</li>
              <li>Handles nested elements and text content</li>
              <li>Configurable array handling for child elements</li>
              <li>Validates XML syntax before conversion</li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-2">Conversion Rules:</h4>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
              <li>XML elements become JSON object properties</li>
              <li>XML attributes are stored in @attributes objects</li>
              <li>Text content is stored as #text or direct values</li>
              <li>Multiple elements with same name become arrays</li>
              <li>Empty elements become null values</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-2">Example Conversion:</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h5 className="font-semibold text-sm mb-2">XML Input:</h5>
                <pre className="bg-muted p-3 rounded text-xs font-mono">
{`<book id="1">
  <title>Example</title>
  <author>John Doe</author>
</book>`}
                </pre>
              </div>
              <div>
                <h5 className="font-semibold text-sm mb-2">JSON Output:</h5>
                <pre className="bg-muted p-3 rounded text-xs font-mono">
{`{
  "book": {
    "@attributes": {
      "id": "1"
    },
    "title": "Example",
    "author": "John Doe"
  }
}`}
                </pre>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-2">Limitations:</h4>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
              <li>Basic XML parsing - complex XML features may not be supported</li>
              <li>Namespaces are treated as part of element names</li>
              <li>CDATA sections are treated as regular text</li>
              <li>Processing instructions are ignored</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}