'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { IconRefresh, IconCopy, IconCheck } from '@tabler/icons-react';
import CopyButton from '@/components/common/CopyButton';
import CollapsibleGuide from '@/components/common/CollapsibleGuide';

export default function UuidGeneratorTool() {
  const [uuids, setUuids] = useState<string[]>([]);
  const [count, setCount] = useState(1);
  const [version, setVersion] = useState<'v4' | 'v1'>('v4');

  // Generate UUID v4 (random)
  const generateUuidV4 = (): string => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  };

  // Generate UUID v1 (timestamp-based, simplified)
  const generateUuidV1 = (): string => {
    const timestamp = Date.now();
    const random = Math.random().toString(16).substring(2, 15);
    const timestampHex = timestamp.toString(16).padStart(12, '0');
    
    return [
      timestampHex.substring(0, 8),
      timestampHex.substring(8, 12),
      '1' + timestampHex.substring(12, 15),
      '8' + random.substring(0, 3),
      random.substring(3, 15)
    ].join('-');
  };

  const generateUuids = () => {
    const newUuids: string[] = [];
    for (let i = 0; i < count; i++) {
      newUuids.push(version === 'v4' ? generateUuidV4() : generateUuidV1());
    }
    setUuids(newUuids);
  };

  const copyAllUuids = () => {
    const allUuids = uuids.join('\n');
    navigator.clipboard.writeText(allUuids);
  };

  // Generate initial UUID on component mount
  useState(() => {
    generateUuids();
  });

  return (
    <div className="space-y-6">
      {/* Controls */}
      <Card>
        <CardHeader>
          <CardTitle>UUID Generator Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex items-center gap-2">
              <label htmlFor="count" className="text-sm font-medium">Count:</label>
              <select
                id="count"
                value={count}
                onChange={(e) => setCount(Number(e.target.value))}
                className="px-3 py-1 border rounded text-sm"
              >
                {[1, 5, 10, 25, 50, 100].map(num => (
                  <option key={num} value={num}>{num}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2">
              <label htmlFor="version" className="text-sm font-medium">Version:</label>
              <select
                id="version"
                value={version}
                onChange={(e) => setVersion(e.target.value as 'v4' | 'v1')}
                className="px-3 py-1 border rounded text-sm"
              >
                <option value="v4">UUID v4 (Random)</option>
                <option value="v1">UUID v1 (Timestamp)</option>
              </select>
            </div>

            <Button onClick={generateUuids} className="flex items-center gap-2">
              <IconRefresh className="h-4 w-4" />
              Generate
            </Button>

            {uuids.length > 1 && (
              <Button variant="outline" onClick={copyAllUuids} className="flex items-center gap-2">
                <IconCopy className="h-4 w-4" />
                Copy All
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Generated UUIDs */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Generated UUIDs</CardTitle>
            <Badge variant="secondary">{uuids.length} UUID{uuids.length !== 1 ? 's' : ''}</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {uuids.map((uuid, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-muted rounded font-mono text-sm">
                <span className="flex-1">{uuid}</span>
                <CopyButton text={uuid} />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Documentation */}
      <CollapsibleGuide title="UUID Generator Guide">
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold mb-2">What is a UUID?</h4>
            <p className="text-sm text-muted-foreground">
              A Universally Unique Identifier (UUID) is a 128-bit number used to identify 
              information in computer systems. UUIDs are designed to be unique across space and time.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-2">UUID Versions:</h4>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
              <li><strong>UUID v4 (Random):</strong> Generated using random or pseudo-random numbers. Most commonly used.</li>
              <li><strong>UUID v1 (Timestamp):</strong> Based on timestamp and MAC address. Includes time information.</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-2">Common use cases:</h4>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
              <li>Database primary keys</li>
              <li>API request/response tracking</li>
              <li>File and resource identification</li>
              <li>Session and transaction IDs</li>
              <li>Distributed system identifiers</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-2">Format:</h4>
            <div className="bg-muted p-3 rounded text-sm font-mono">
              xxxxxxxx-xxxx-Mxxx-Nxxx-xxxxxxxxxxxx
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              Where M indicates the version (1 or 4) and N indicates the variant.
            </p>
          </div>
        </div>
      </CollapsibleGuide>
    </div>
  );
}