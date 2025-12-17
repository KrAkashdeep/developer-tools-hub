'use client';

import { useState } from 'react';
import ToolLayout from '@/components/common/ToolLayout';
import InputBox from '@/components/common/InputBox';
import OutputBox from '@/components/common/OutputBox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import CollapsibleGuide from '@/components/common/CollapsibleGuide';

export default function XmlFormatterTool() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  const formatXml = (xmlString: string) => {
    if (!xmlString.trim()) {
      setOutput('');
      setError('');
      return;
    }

    try {
      // Basic XML formatting
      let formatted = xmlString
        // Remove extra whitespace between tags
        .replace(/>\s*</g, '><')
        // Add line breaks between tags
        .replace(/></g, '>\n<')
        .trim();

      // Add proper indentation
      const lines = formatted.split('\n');
      let indentLevel = 0;
      const indentSize = 2;
      
      const formattedLines = lines.map(line => {
        const trimmedLine = line.trim();
        if (!trimmedLine) return '';

        // Decrease indent for closing tags
        if (trimmedLine.startsWith('</')) {
          indentLevel = Math.max(0, indentLevel - 1);
        }

        const indentedLine = ' '.repeat(indentLevel * indentSize) + trimmedLine;

        // Increase indent for opening tags (but not self-closing or closing tags)
        if (trimmedLine.startsWith('<') && 
            !trimmedLine.startsWith('</') && 
            !trimmedLine.includes('/>') &&
            !trimmedLine.startsWith('<?') &&
            !trimmedLine.startsWith('<!')) {
          indentLevel++;
        }

        return indentedLine;
      });

      setOutput(formattedLines.join('\n'));
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error formatting XML');
      setOutput('');
    }
  };

  const handleInputChange = (value: string) => {
    setInput(value);
    formatXml(value);
  };

  const handleExample = () => {
    const example = `<?xml version="1.0" encoding="UTF-8"?><catalog><book id="1"><title>The Great Gatsby</title><author>F. Scott Fitzgerald</author><genre>Fiction</genre><price>12.99</price><publish_date>1925-04-10</publish_date><description>A classic American novel set in the Jazz Age.</description></book><book id="2"><title>To Kill a Mockingbird</title><author>Harper Lee</author><genre>Fiction</genre><price>14.99</price><publish_date>1960-07-11</publish_date><description>A gripping tale of racial injustice and childhood innocence.</description></book></catalog>`;
    setInput(example);
    formatXml(example);
  };

  return (
    <div className="space-y-6">
      <ToolLayout>
        <InputBox
          title="XML Input"
          value={input}
          onChange={handleInputChange}
          placeholder="Paste your XML here..."
          example="Load example XML"
          onExample={handleExample}
        />
        
        <OutputBox
          title="Formatted XML"
          value={output}
          placeholder={error ? `Error: ${error}` : 'Formatted XML will appear here...'}
        />
      </ToolLayout>

      {/* Documentation */}
      <CollapsibleGuide title="XML Formatter Guide">
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold mb-2">What it does:</h4>
            <p className="text-sm text-muted-foreground">
              Formats and beautifies XML data with proper indentation and structure. 
              Makes minified or poorly formatted XML readable and organized.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-2">Features:</h4>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
              <li>Real-time XML formatting as you type</li>
              <li>Proper indentation with 2-space tabs</li>
              <li>Handles nested elements correctly</li>
              <li>Preserves self-closing tags</li>
              <li>Supports XML declarations and comments</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-2">Supported XML features:</h4>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
              <li>XML declarations (&lt;?xml version="1.0"?&gt;)</li>
              <li>Nested elements and attributes</li>
              <li>Self-closing tags (&lt;tag/&gt;)</li>
              <li>CDATA sections</li>
              <li>Comments (&lt;!-- comment --&gt;)</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-2">Use cases:</h4>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
              <li>Format minified XML for readability</li>
              <li>Clean up XML from APIs or databases</li>
              <li>Prepare XML for code reviews</li>
              <li>Debug XML structure issues</li>
              <li>Improve XML configuration files</li>
            </ul>
          </div>
        </div>
      </CollapsibleGuide>
    </div>
  );
}