'use client';

import { useState } from 'react';
import ToolLayout from '@/components/common/ToolLayout';
import InputBox from '@/components/common/InputBox';
import OutputBox from '@/components/common/OutputBox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import CollapsibleGuide from '@/components/common/CollapsibleGuide';

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

      <CollapsibleGuide title="JWT Decoder Guide">
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold mb-2">What it does:</h4>
            <p className="text-sm text-muted-foreground">
              Decodes JWT (JSON Web Token) to view header and payload information. 
              Note: This tool only decodes - it does not verify signatures.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-2">JWT structure:</h4>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
              <li><strong>Header:</strong> Contains algorithm and token type</li>
              <li><strong>Payload:</strong> Contains claims (user data, expiration, etc.)</li>
              <li><strong>Signature:</strong> Used to verify token authenticity</li>
              <li>Format: header.payload.signature (Base64 encoded)</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-2">Common claims:</h4>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
              <li><strong>sub:</strong> Subject (user ID)</li>
              <li><strong>iat:</strong> Issued at (timestamp)</li>
              <li><strong>exp:</strong> Expiration time</li>
              <li><strong>aud:</strong> Audience</li>
              <li><strong>iss:</strong> Issuer</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-2">Security note:</h4>
            <p className="text-sm text-muted-foreground">
              This tool only decodes JWTs for inspection. It does not verify signatures 
              or validate tokens. Never trust decoded JWT data without proper verification.
            </p>
          </div>
        </div>
      </CollapsibleGuide>
    </div>
  );
}