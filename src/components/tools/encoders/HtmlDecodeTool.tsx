'use client';

import { useState } from 'react';
import ToolLayout from '@/components/common/ToolLayout';
import InputBox from '@/components/common/InputBox';
import OutputBox from '@/components/common/OutputBox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function HtmlDecodeTool() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');

  const decodeHtml = (text: string) => {
    if (!text) {
      setOutput('');
      return;
    }

    const decoded = text
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#x27;/g, "'")
      .replace(/&#x2F;/g, '/')
      .replace(/&#39;/g, "'")
      .replace(/&nbsp;/g, ' ')
      .replace(/&copy;/g, '©')
      .replace(/&reg;/g, '®')
      .replace(/&trade;/g, '™')
      .replace(/&euro;/g, '€')
      .replace(/&pound;/g, '£')
      .replace(/&yen;/g, '¥')
      .replace(/&cent;/g, '¢')
      // Decode numeric entities
      .replace(/&#(\d+);/g, (match, dec) => String.fromCharCode(dec))
      .replace(/&#x([0-9a-fA-F]+);/g, (match, hex) => String.fromCharCode(parseInt(hex, 16)));

    setOutput(decoded);
  };

  const handleInputChange = (value: string) => {
    setInput(value);
    decodeHtml(value);
  };

  const handleExample = () => {
    const example = '&lt;div class=&quot;example&quot;&gt;Hello &amp; &quot;welcome&quot; to HTML decoding!&lt;/div&gt;&lt;p&gt;Special chars: &copy; &reg; &trade; &euro; &pound;&lt;/p&gt;';
    setInput(example);
    decodeHtml(example);
  };

  return (
    <div className="space-y-6">
      <ToolLayout>
        <InputBox
          title="HTML Encoded Text"
          value={input}
          onChange={handleInputChange}
          placeholder="Enter HTML encoded text to decode..."
          example="Load example encoded text"
          onExample={handleExample}
        />
        
        <OutputBox
          title="Decoded Text"
          value={output}
          placeholder="Decoded text will appear here..."
        />
      </ToolLayout>

      {/* Documentation */}
      <Card>
        <CardHeader>
          <CardTitle>How to use HTML Decoder</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-semibold mb-2">What it does:</h4>
            <CardDescription>
              Converts HTML entities back to their original characters. Decodes both named entities 
              (&amp;lt;, &amp;gt;) and numeric entities (&#39;, &#x27;).
            </CardDescription>
          </div>
          
          <div>
            <h4 className="font-semibold mb-2">Supported entities:</h4>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
              <li>&amp;lt; → &lt; (less than)</li>
              <li>&amp;gt; → &gt; (greater than)</li>
              <li>&amp;amp; → &amp; (ampersand)</li>
              <li>&amp;quot; → " (quotation mark)</li>
              <li>&amp;#39; → ' (apostrophe)</li>
              <li>&amp;nbsp; → (non-breaking space)</li>
              <li>&amp;copy; → © (copyright)</li>
              <li>Numeric entities (&#123; and &#x7B;)</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-2">Use cases:</h4>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
              <li>Decode HTML content from databases</li>
              <li>Process encoded form submissions</li>
              <li>Convert encoded XML/HTML data</li>
              <li>Debug web scraping results</li>
              <li>Process API responses with encoded content</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}