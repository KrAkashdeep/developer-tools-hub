'use client';

import { useState } from 'react';
import ToolLayout from '@/components/common/ToolLayout';
import InputBox from '@/components/common/InputBox';
import OutputBox from '@/components/common/OutputBox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import CollapsibleGuide from '@/components/common/CollapsibleGuide';

export default function UuidValidatorTool() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [uuidInfo, setUuidInfo] = useState<any>(null);

  const validateUuid = (uuid: string) => {
    if (!uuid.trim()) {
      setOutput('');
      setIsValid(null);
      setUuidInfo(null);
      return;
    }

    const trimmedUuid = uuid.trim();
    
    // UUID regex pattern
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    
    const valid = uuidRegex.test(trimmedUuid);
    setIsValid(valid);
    
    if (valid) {
      const info = analyzeUuid(trimmedUuid);
      setUuidInfo(info);
      setOutput(`✓ Valid UUID (Version ${info.version})`);
    } else {
      setUuidInfo(null);
      setOutput('✗ Invalid UUID format');
    }
  };

  const analyzeUuid = (uuid: string) => {
    const parts = uuid.split('-');
    const versionHex = parts[2].charAt(0);
    const variantHex = parts[3].charAt(0);
    
    // Determine version
    const version = parseInt(versionHex, 16);
    
    // Determine variant
    let variant = '';
    const variantBits = parseInt(variantHex, 16);
    if ((variantBits & 0x8) === 0) {
      variant = 'NCS backward compatibility';
    } else if ((variantBits & 0xC) === 0x8) {
      variant = 'RFC 4122';
    } else if ((variantBits & 0xE) === 0xC) {
      variant = 'Microsoft GUID';
    } else {
      variant = 'Reserved for future use';
    }

    // Version descriptions
    const versionDescriptions: { [key: number]: string } = {
      1: 'Time-based',
      2: 'DCE Security',
      3: 'Name-based (MD5)',
      4: 'Random',
      5: 'Name-based (SHA-1)'
    };

    return {
      version,
      versionDescription: versionDescriptions[version] || 'Unknown',
      variant,
      format: 'Standard UUID',
      parts: {
        timeLow: parts[0],
        timeMid: parts[1],
        timeHiAndVersion: parts[2],
        clockSeqAndReserved: parts[3],
        node: parts[4]
      }
    };
  };

  const handleInputChange = (value: string) => {
    setInput(value);
    validateUuid(value);
  };

  const handleExample = () => {
    const examples = [
      '550e8400-e29b-41d4-a716-446655440000', // Version 4
      '6ba7b810-9dad-11d1-80b4-00c04fd430c8', // Version 1
      '6ba7b811-9dad-11d1-80b4-00c04fd430c8', // Version 1
      '550e8400-e29b-31d4-a716-446655440000', // Version 3
      '550e8400-e29b-51d4-a716-446655440000'  // Version 5
    ];
    const example = examples[Math.floor(Math.random() * examples.length)];
    setInput(example);
    validateUuid(example);
  };

  return (
    <div className="space-y-6">
      <ToolLayout>
        <InputBox
          title="UUID to Validate"
          value={input}
          onChange={handleInputChange}
          placeholder="Enter UUID to validate (e.g., 550e8400-e29b-41d4-a716-446655440000)..."
          type="input"
          example="Load random example"
          onExample={handleExample}
        />
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Validation Result</h3>
            {isValid !== null && (
              <Badge variant={isValid ? 'secondary' : 'destructive'}>
                {isValid ? 'Valid' : 'Invalid'}
              </Badge>
            )}
          </div>
          
          <OutputBox
            title="Result"
            value={output}
            placeholder="Validation result will appear here..."
          />

          {uuidInfo && isValid && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">UUID Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Version:</span>
                  <span className="font-mono">{uuidInfo.version}</span>
                </div>
                <div className="flex justify-between">
                  <span>Type:</span>
                  <span className="font-mono">{uuidInfo.versionDescription}</span>
                </div>
                <div className="flex justify-between">
                  <span>Variant:</span>
                  <span className="font-mono text-xs">{uuidInfo.variant}</span>
                </div>
                <div className="flex justify-between">
                  <span>Format:</span>
                  <span className="font-mono">{uuidInfo.format}</span>
                </div>
                
                <div className="mt-4">
                  <h5 className="font-semibold mb-2">UUID Parts:</h5>
                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between">
                      <span>Time Low:</span>
                      <span className="font-mono">{uuidInfo.parts.timeLow}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Time Mid:</span>
                      <span className="font-mono">{uuidInfo.parts.timeMid}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Time Hi & Version:</span>
                      <span className="font-mono">{uuidInfo.parts.timeHiAndVersion}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Clock Seq:</span>
                      <span className="font-mono">{uuidInfo.parts.clockSeqAndReserved}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Node:</span>
                      <span className="font-mono">{uuidInfo.parts.node}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </ToolLayout>

      {/* Documentation */}
      <CollapsibleGuide title="UUID Validator Guide">
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold mb-2">UUID format:</h4>
            <CardDescription>
              UUIDs are 128-bit identifiers displayed as 32 hexadecimal digits in the format: 
              xxxxxxxx-xxxx-Mxxx-Nxxx-xxxxxxxxxxxx
            </CardDescription>
          </div>
          
          <div>
            <h4 className="font-semibold mb-2">UUID versions:</h4>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
              <li><strong>Version 1:</strong> Time-based with MAC address</li>
              <li><strong>Version 2:</strong> DCE Security (rarely used)</li>
              <li><strong>Version 3:</strong> Name-based using MD5 hash</li>
              <li><strong>Version 4:</strong> Random or pseudo-random</li>
              <li><strong>Version 5:</strong> Name-based using SHA-1 hash</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-2">Validation rules:</h4>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
              <li>Must be 36 characters long (including hyphens)</li>
              <li>Must contain only hexadecimal digits and hyphens</li>
              <li>Must follow the pattern: 8-4-4-4-12</li>
              <li>Version digit (M) must be 1-5</li>
              <li>Variant bits (N) must be 8, 9, A, or B</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-2">Common use cases:</h4>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
              <li>Database primary keys</li>
              <li>API request/response tracking</li>
              <li>File and resource identification</li>
              <li>Session and transaction IDs</li>
            </ul>
          </div>
        </div>
      </CollapsibleGuide>
    </div>
  );
}