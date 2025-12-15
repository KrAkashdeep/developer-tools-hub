'use client';

import { useState } from 'react';
import ToolLayout from '@/components/common/ToolLayout';
import InputBox from '@/components/common/InputBox';
import OutputBox from '@/components/common/OutputBox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function JwtDecoderTool() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [jwtParts, setJwtParts] = useState<any>(null);

  const decodeJwt = (token: string) => {
    if (!token.trim()) {
      setOutput('');
      setError('');
      setJwtParts(null);
      return;
    }

    try {
      const parts = token.split('.');
      if (parts.length !== 3) {
        throw new Error('Invalid JWT format');
      }

      const header = JSON.parse(atob(parts[0].replace(/-/g, '+').replace(/_/g, '/')));
      const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')));

      setJwtParts({ header, payload, signature: parts[2] });
      setOutput(JSON.stringify({ header, payload }, null, 2));
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid JWT token');
      setOutput('');
      setJwtParts(null);
    }
  };

  const handleInputChange = (value: string) => {
    setInput(value);
    decodeJwt(value);
  };

  const handleExample = () => {
    const example = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';
    setInput(example);
    decodeJwt(example);
  };

  return (
    <div className="space-y-6">
      <ToolLayout>
        <InputBox
          title="JWT Token"
          value={input}
          onChange={handleInputChange}
          placeholder="Paste JWT token here..."
          example="Load example JWT"
          onExample={handleExample}
        />
        <OutputBox
          title="Decoded JWT"
          value={output}
          placeholder={error ? `Error: ${error}` : 'Decoded JWT will appear here...'}
        />
      </ToolLayout>

      {jwtParts && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Header</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="bg-muted p-3 rounded text-sm overflow-x-auto">
                {JSON.stringify(jwtParts.header, null, 2)}
              </pre>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Payload</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="bg-muted p-3 rounded text-sm overflow-x-auto">
                {JSON.stringify(jwtParts.payload, null, 2)}
              </pre>
            </CardContent>
          </Card>
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>JWT Decoder</CardTitle>
        </CardHeader>
        <CardContent>
          <CardDescription>
            Decodes JWT (JSON Web Token) to view header and payload information. Note: This tool only decodes - it does not verify signatures.
          </CardDescription>
        </CardContent>
      </Card>
    </div>
  );
}