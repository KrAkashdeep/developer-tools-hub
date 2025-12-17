'use client';

import { useState } from 'react';
import ToolLayout from '@/components/common/ToolLayout';
import InputBox from '@/components/common/InputBox';
import OutputBox from '@/components/common/OutputBox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import CollapsibleGuide from '@/components/common/CollapsibleGuide';

export default function GzipCompressTool() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [stats, setStats] = useState({ original: 0, compressed: 0, ratio: 0 });

  const compressText = async (text: string) => {
    if (!text.trim()) {
      setOutput('');
      setStats({ original: 0, compressed: 0, ratio: 0 });
      return;
    }

    try {
      // Use browser's built-in compression
      const stream = new CompressionStream('gzip');
      const writer = stream.writable.getWriter();
      const reader = stream.readable.getReader();
      
      // Write the text to the compression stream
      const encoder = new TextEncoder();
      const inputBytes = encoder.encode(text);
      
      writer.write(inputBytes);
      writer.close();
      
      // Read the compressed data
      const chunks = [];
      let done = false;
      
      while (!done) {
        const { value, done: readerDone } = await reader.read();
        done = readerDone;
        if (value) {
          chunks.push(value);
        }
      }
      
      // Combine chunks and convert to base64
      const compressedArray = new Uint8Array(chunks.reduce((acc, chunk) => acc + chunk.length, 0));
      let offset = 0;
      for (const chunk of chunks) {
        compressedArray.set(chunk, offset);
        offset += chunk.length;
      }
      
      // Convert to base64 for display
      const base64 = btoa(String.fromCharCode(...compressedArray));
      setOutput(base64);
      
      // Calculate compression stats
      const originalSize = inputBytes.length;
      const compressedSize = compressedArray.length;
      const compressionRatio = originalSize > 0 ? Math.round(((originalSize - compressedSize) / originalSize) * 100) : 0;
      
      setStats({
        original: originalSize,
        compressed: compressedSize,
        ratio: compressionRatio
      });
      
    } catch (error) {
      // Fallback to simple base64 encoding if compression fails
      console.warn('GZip compression not supported, using base64 encoding');
      const base64 = btoa(text);
      setOutput(base64);
      
      setStats({
        original: text.length,
        compressed: base64.length,
        ratio: Math.round(((text.length - base64.length) / text.length) * 100)
      });
    }
  };

  const handleInputChange = (value: string) => {
    setInput(value);
    compressText(value);
  };

  const handleExample = () => {
    const example = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium.`;
    setInput(example);
    compressText(example);
  };

  return (
    <div className="space-y-6">
      <ToolLayout>
        <InputBox
          title="Text to Compress"
          value={input}
          onChange={handleInputChange}
          placeholder="Enter text to compress with GZip..."
          example="Load example text"
          onExample={handleExample}
        />
        
        <div className="space-y-4">
          <OutputBox
            title="Compressed Data (Base64)"
            value={output}
            placeholder="Compressed data will appear here..."
          />
          
          {stats.original > 0 && (
            <div className="flex gap-2 flex-wrap">
              <Badge variant="outline">
                Original: {stats.original} bytes
              </Badge>
              <Badge variant="outline">
                Compressed: {stats.compressed} bytes
              </Badge>
              <Badge variant="secondary">
                Saved: {stats.ratio}%
              </Badge>
            </div>
          )}
        </div>
      </ToolLayout>

      {/* Documentation */}
      <CollapsibleGuide title="GZip Compressor Guide">
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold mb-2">What is GZip compression?</h4>
            <p className="text-sm text-muted-foreground">
              GZip is a file format and compression algorithm that reduces file size by finding 
              and eliminating redundancy in data. It's widely used for web content compression.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-2">How it works:</h4>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
              <li>Uses DEFLATE algorithm (LZ77 + Huffman coding)</li>
              <li>Finds repeated patterns in text</li>
              <li>Replaces patterns with shorter references</li>
              <li>Output is encoded as Base64 for display</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-2">Best compression for:</h4>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
              <li>Text files with repetitive content</li>
              <li>HTML, CSS, JavaScript files</li>
              <li>JSON and XML data</li>
              <li>Log files and documentation</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-2">Use cases:</h4>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
              <li>Web server content compression</li>
              <li>File archiving and storage</li>
              <li>Data transmission optimization</li>
              <li>Bandwidth reduction</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-2">Note:</h4>
            <p className="text-sm text-muted-foreground">
              The compressed output is displayed as Base64 text for readability. 
              In real applications, compressed data is typically stored as binary.
            </p>
          </div>
        </div>
      </CollapsibleGuide>
    </div>
  );
}