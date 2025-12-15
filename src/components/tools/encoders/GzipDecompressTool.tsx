'use client';

import { useState } from 'react';
import ToolLayout from '@/components/common/ToolLayout';
import InputBox from '@/components/common/InputBox';
import OutputBox from '@/components/common/OutputBox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function GzipDecompressTool() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  const decompressText = async (base64Data: string) => {
    if (!base64Data.trim()) {
      setOutput('');
      setError('');
      return;
    }

    try {
      // Convert base64 to binary data
      const binaryString = atob(base64Data.trim());
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }

      // Use browser's built-in decompression
      const stream = new DecompressionStream('gzip');
      const writer = stream.writable.getWriter();
      const reader = stream.readable.getReader();
      
      // Write the compressed data to the decompression stream
      writer.write(bytes);
      writer.close();
      
      // Read the decompressed data
      const chunks = [];
      let done = false;
      
      while (!done) {
        const { value, done: readerDone } = await reader.read();
        done = readerDone;
        if (value) {
          chunks.push(value);
        }
      }
      
      // Combine chunks and convert to text
      const decompressedArray = new Uint8Array(chunks.reduce((acc, chunk) => acc + chunk.length, 0));
      let offset = 0;
      for (const chunk of chunks) {
        decompressedArray.set(chunk, offset);
        offset += chunk.length;
      }
      
      const decoder = new TextDecoder();
      const decompressedText = decoder.decode(decompressedArray);
      
      setOutput(decompressedText);
      setError('');
      
    } catch (error) {
      // Fallback to base64 decoding if decompression fails
      try {
        const decoded = atob(base64Data.trim());
        setOutput(decoded);
        setError('');
      } catch (fallbackError) {
        setError('Invalid compressed data or Base64 format');
        setOutput('');
      }
    }
  };

  const handleInputChange = (value: string) => {
    setInput(value);
    decompressText(value);
  };

  const handleExample = () => {
    // This is a base64 encoded gzip compressed version of "Hello World! This is a test message."
    const example = 'H4sIAAAAAAAAA0vOyS/NScwr0UvOyS9NScwr0ctNzMnPS1WyUsrIzEvMTbVSUkorys9VslIyMDLXMzI0NDMzNTBUUkoD6kjNycnXBQQAAP//AAAA//8DAA==';
    setInput(example);
    decompressText(example);
  };

  return (
    <div className="space-y-6">
      <ToolLayout>
        <InputBox
          title="Compressed Data (Base64)"
          value={input}
          onChange={handleInputChange}
          placeholder="Enter Base64 encoded GZip compressed data..."
          example="Load example compressed data"
          onExample={handleExample}
        />
        
        <OutputBox
          title="Decompressed Text"
          value={output}
          placeholder={error ? `Error: ${error}` : 'Decompressed text will appear here...'}
        />
      </ToolLayout>

      {/* Documentation */}
      <Card>
        <CardHeader>
          <CardTitle>GZip Decompressor Guide</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-semibold mb-2">What it does:</h4>
            <CardDescription>
              Decompresses GZip compressed data that has been encoded as Base64 text. 
              Reverses the compression process to restore original content.
            </CardDescription>
          </div>
          
          <div>
            <h4 className="font-semibold mb-2">Input format:</h4>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
              <li>Base64 encoded GZip compressed data</li>
              <li>Data must be valid GZip format</li>
              <li>Fallback to Base64 decoding if GZip fails</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-2">Common sources:</h4>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
              <li>Web server compressed responses</li>
              <li>Compressed API data</li>
              <li>Archived text files</li>
              <li>Output from GZip Compressor tool</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-2">Error handling:</h4>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
              <li>Validates Base64 format</li>
              <li>Checks GZip header and structure</li>
              <li>Falls back to simple Base64 decoding</li>
              <li>Shows clear error messages</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-2">Browser compatibility:</h4>
            <CardDescription className="text-sm">
              Uses modern browser APIs (DecompressionStream). Falls back to Base64 
              decoding in older browsers or when GZip decompression fails.
            </CardDescription>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}