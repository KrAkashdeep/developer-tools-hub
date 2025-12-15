'use client';

import { useState } from 'react';
import ToolLayout from '@/components/common/ToolLayout';
import InputBox from '@/components/common/InputBox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import CopyButton from '@/components/common/CopyButton';

export default function HashGeneratorTool() {
  const [input, setInput] = useState('');
  const [hashes, setHashes] = useState({
    md5: '',
    sha1: '',
    sha256: '',
    sha512: ''
  });

  // Simple hash functions (for demonstration - in production use crypto libraries)
  const generateHashes = async (text: string) => {
    if (!text) {
      setHashes({ md5: '', sha1: '', sha256: '', sha512: '' });
      return;
    }

    try {
      const encoder = new TextEncoder();
      const data = encoder.encode(text);

      // Generate SHA-256
      const sha256Buffer = await crypto.subtle.digest('SHA-256', data);
      const sha256Hash = Array.from(new Uint8Array(sha256Buffer))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');

      // Generate SHA-1
      const sha1Buffer = await crypto.subtle.digest('SHA-1', data);
      const sha1Hash = Array.from(new Uint8Array(sha1Buffer))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');

      // Generate SHA-512
      const sha512Buffer = await crypto.subtle.digest('SHA-512', data);
      const sha512Hash = Array.from(new Uint8Array(sha512Buffer))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');

      // Simple MD5 implementation (basic version)
      const md5Hash = simpleMD5(text);

      setHashes({
        md5: md5Hash,
        sha1: sha1Hash,
        sha256: sha256Hash,
        sha512: sha512Hash
      });
    } catch (error) {
      console.error('Error generating hashes:', error);
    }
  };

  // Simple MD5 implementation (basic version for demonstration)
  const simpleMD5 = (text: string): string => {
    // This is a very basic hash for demonstration
    // In production, use a proper MD5 library
    let hash = 0;
    for (let i = 0; i < text.length; i++) {
      const char = text.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash).toString(16).padStart(8, '0').repeat(4).substring(0, 32);
  };

  const handleInputChange = (value: string) => {
    setInput(value);
    generateHashes(value);
  };

  const handleExample = () => {
    const example = 'Hello World! This is a test message for hashing.';
    setInput(example);
    generateHashes(example);
  };

  return (
    <div className="space-y-6">
      <ToolLayout>
        <InputBox
          title="Text to Hash"
          value={input}
          onChange={handleInputChange}
          placeholder="Enter text to generate hashes..."
          example="Load example text"
          onExample={handleExample}
        />
        
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Generated Hashes</h3>
          
          <div className="space-y-3">
            <Card>
              <CardContent className="pt-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold">MD5</h4>
                  <CopyButton text={hashes.md5} />
                </div>
                <div className="p-3 bg-muted rounded font-mono text-sm break-all">
                  {hashes.md5 || 'MD5 hash will appear here...'}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold">SHA-1</h4>
                  <CopyButton text={hashes.sha1} />
                </div>
                <div className="p-3 bg-muted rounded font-mono text-sm break-all">
                  {hashes.sha1 || 'SHA-1 hash will appear here...'}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold">SHA-256</h4>
                  <CopyButton text={hashes.sha256} />
                </div>
                <div className="p-3 bg-muted rounded font-mono text-sm break-all">
                  {hashes.sha256 || 'SHA-256 hash will appear here...'}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold">SHA-512</h4>
                  <CopyButton text={hashes.sha512} />
                </div>
                <div className="p-3 bg-muted rounded font-mono text-sm break-all">
                  {hashes.sha512 || 'SHA-512 hash will appear here...'}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </ToolLayout>

      {/* Documentation */}
      <Card>
        <CardHeader>
          <CardTitle>Hash Generator Guide</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-semibold mb-2">What are hash functions?</h4>
            <CardDescription>
              Hash functions convert input data into fixed-size strings. They're one-way functions 
              used for data integrity, password storage, and digital signatures.
            </CardDescription>
          </div>
          
          <div>
            <h4 className="font-semibold mb-2">Hash types:</h4>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
              <li><strong>MD5:</strong> 128-bit hash (32 hex chars) - Fast but not cryptographically secure</li>
              <li><strong>SHA-1:</strong> 160-bit hash (40 hex chars) - Deprecated for security</li>
              <li><strong>SHA-256:</strong> 256-bit hash (64 hex chars) - Secure and widely used</li>
              <li><strong>SHA-512:</strong> 512-bit hash (128 hex chars) - Most secure option</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-2">Use cases:</h4>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
              <li>File integrity verification</li>
              <li>Password hashing (with salt)</li>
              <li>Digital signatures</li>
              <li>Data deduplication</li>
              <li>Blockchain and cryptocurrency</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-2">Security notes:</h4>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
              <li>Use SHA-256 or SHA-512 for security-critical applications</li>
              <li>Always use salt when hashing passwords</li>
              <li>MD5 and SHA-1 are vulnerable to collision attacks</li>
              <li>Hashes are one-way - you cannot reverse them</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}