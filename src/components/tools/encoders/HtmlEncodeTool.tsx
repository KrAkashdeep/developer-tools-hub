'use client';

import { useState } from 'react';
import ToolLayout from '@/components/common/ToolLayout';
import InputBox from '@/components/common/InputBox';
import OutputBox from '@/components/common/OutputBox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import CollapsibleGuide from '@/components/common/CollapsibleGuide';

export default function HtmlEncodeTool() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');

  const encodeHtml = (text: string) => {
    if (!text) {
      setOutput('');
      return;
    }

    const encoded = text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .replace(/\//g, '&#x2F;');

    setOutput(encoded);
  };

  const handleInputChange = (value: string) => {
    setInput(value);
    encodeHtml(value);
  };

  const handleExample = () => {
    const example = '<div class="example">Hello & "welcome" to HTML encoding!</div>';
    setInput(example);
    encodeHtml(example);
  };

  return (
    <div className="space-y-6">
      <ToolLayout>
        <InputBox
          title="Text to Encode"
          value={input}
          onChange={handleInputChange}
          placeholder="Enter text to HTML encode..."
          example="Load example text"
          onExample={handleExample}
        />
        <OutputBox
          title="HTML Encoded"
          value={output}
          placeholder="HTML encoded text will appear here..."
        />
      </ToolLayout>
      <CollapsibleGuide title="HTML Encoder Guide">
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold mb-2">What it does:</h4>
            <p className="text-sm text-muted-foreground">
              Encodes special characters to HTML entities for safe display in web pages.
              Prevents XSS attacks and ensures proper HTML rendering.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-2">Characters encoded:</h4>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
              <li>& → &amp;amp;</li>
              <li>&lt; → &amp;lt;</li>
              <li>&gt; → &amp;gt;</li>
              <li>" → &amp;quot;</li>
              <li>' → &amp;#x27;</li>
              <li>/ → &amp;#x2F;</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-2">Use cases:</h4>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
              <li>Prevent XSS attacks in web applications</li>
              <li>Display HTML code as text</li>
              <li>Safely insert user input into HTML</li>
              <li>Prepare content for HTML attributes</li>
              <li>Encode data for XML documents</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-2">Example:</h4>
            <div className="bg-muted p-3 rounded text-sm font-mono">
              <div>Input: '&lt;script&gt;alert("XSS")&lt;/script&gt;'</div>
              <div>Output: '&amp;lt;script&amp;gt;alert(&amp;quot;XSS&amp;quot;)&amp;lt;/script&amp;gt;'</div>
            </div>
          </div>
        </div>
      </CollapsibleGuide>
    </div>
  );
}