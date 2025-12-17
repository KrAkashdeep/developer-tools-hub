'use client';

import { useState, useEffect } from 'react';
import ToolLayout from '@/components/common/ToolLayout';
import InputBox from '@/components/common/InputBox';
import OutputBox from '@/components/common/OutputBox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import CopyButton from '@/components/common/CopyButton';
import CollapsibleGuide from '@/components/common/CollapsibleGuide';

export default function EpochToDateTool() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [currentEpoch, setCurrentEpoch] = useState('');
  const [unit, setUnit] = useState<'seconds' | 'milliseconds'>('seconds');

  // Update current epoch every second
  useEffect(() => {
    const updateCurrentEpoch = () => {
      const now = Math.floor(Date.now() / 1000);
      setCurrentEpoch(now.toString());
    };

    updateCurrentEpoch();
    const interval = setInterval(updateCurrentEpoch, 1000);
    return () => clearInterval(interval);
  }, []);

  const convertEpochToDate = (epochString: string) => {
    if (!epochString.trim()) {
      setOutput('');
      return;
    }

    try {
      const epochNumber = parseFloat(epochString);
      
      if (isNaN(epochNumber)) {
        setOutput('Error: Invalid timestamp format');
        return;
      }

      // Convert to milliseconds if input is in seconds
      const timestampMs = unit === 'seconds' ? epochNumber * 1000 : epochNumber;
      
      const date = new Date(timestampMs);
      
      if (isNaN(date.getTime())) {
        setOutput('Error: Invalid timestamp value');
        return;
      }

      // Calculate relative time
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffSeconds = Math.floor(diffMs / 1000);
      const diffMinutes = Math.floor(diffSeconds / 60);
      const diffHours = Math.floor(diffMinutes / 60);
      const diffDays = Math.floor(diffHours / 24);

      let relativeTime = '';
      if (Math.abs(diffDays) > 0) {
        relativeTime = `${Math.abs(diffDays)} day${Math.abs(diffDays) !== 1 ? 's' : ''} ${diffDays > 0 ? 'ago' : 'from now'}`;
      } else if (Math.abs(diffHours) > 0) {
        relativeTime = `${Math.abs(diffHours)} hour${Math.abs(diffHours) !== 1 ? 's' : ''} ${diffHours > 0 ? 'ago' : 'from now'}`;
      } else if (Math.abs(diffMinutes) > 0) {
        relativeTime = `${Math.abs(diffMinutes)} minute${Math.abs(diffMinutes) !== 1 ? 's' : ''} ${diffMinutes > 0 ? 'ago' : 'from now'}`;
      } else {
        relativeTime = `${Math.abs(diffSeconds)} second${Math.abs(diffSeconds) !== 1 ? 's' : ''} ${diffSeconds > 0 ? 'ago' : 'from now'}`;
      }

      const result = `Converted Date & Time:

ISO 8601 (UTC): ${date.toISOString()}
UTC String: ${date.toUTCString()}
Local String: ${date.toString()}
Date Only: ${date.toDateString()}
Time Only: ${date.toTimeString()}

Formatted Dates:
- US Format: ${date.toLocaleDateString('en-US')}
- European Format: ${date.toLocaleDateString('en-GB')}
- Long Format: ${date.toLocaleDateString('en-US', { 
  weekday: 'long', 
  year: 'numeric', 
  month: 'long', 
  day: 'numeric' 
})}

Time Information:
- 12-hour format: ${date.toLocaleTimeString('en-US')}
- 24-hour format: ${date.toLocaleTimeString('en-GB')}
- Timezone: ${Intl.DateTimeFormat().resolvedOptions().timeZone}
- Timezone Offset: ${date.getTimezoneOffset()} minutes

Relative Time: ${relativeTime}

Original Timestamp:
- Seconds: ${Math.floor(timestampMs / 1000)}
- Milliseconds: ${timestampMs}`;

      setOutput(result);
    } catch (error) {
      setOutput(`Error: ${error instanceof Error ? error.message : 'Invalid timestamp'}`);
    }
  };

  const handleInputChange = (value: string) => {
    setInput(value);
    convertEpochToDate(value);
  };

  const handleExample = () => {
    const example = '1765454400'; // December 11, 2025 12:00:00 UTC
    setInput(example);
    convertEpochToDate(example);
  };

  const useCurrentEpoch = () => {
    setInput(currentEpoch);
    convertEpochToDate(currentEpoch);
  };

  const commonTimestamps = [
    { name: 'Unix Epoch Start', value: '0', description: 'January 1, 1970 00:00:00 UTC' },
    { name: 'Y2K', value: '946684800', description: 'January 1, 2000 00:00:00 UTC' },
    { name: 'Current Time', value: currentEpoch, description: 'Right now' },
    { name: 'Future Example', value: '2000000000', description: 'May 18, 2033 03:33:20 UTC' },
  ];

  return (
    <div className="space-y-6">
      <ToolLayout>
        <InputBox
          title="Unix Timestamp"
          value={input}
          onChange={handleInputChange}
          placeholder="Enter Unix timestamp (e.g., 1733918400 for seconds or 1733918400000 for milliseconds)..."
          example="Load example timestamp"
          onExample={handleExample}
        />
        
        <OutputBox
          title="Converted Date & Time"
          value={output}
          placeholder="Converted date and time information will appear here..."
          rows={15}
        />
      </ToolLayout>

      {/* Current Epoch Display */}
      <Card>
        <CardHeader>
          <CardTitle>Current Unix Timestamp</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-muted rounded">
            <div>
              <div className="font-semibold">Current Timestamp (seconds)</div>
              <div className="font-mono text-sm">{currentEpoch}</div>
            </div>
            <CopyButton text={currentEpoch} />
          </div>
          
          <Button onClick={useCurrentEpoch} className="w-full">
            Use Current Timestamp
          </Button>
        </CardContent>
      </Card>

      {/* Unit Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Timestamp Unit</CardTitle>
        </CardHeader>
        <CardContent>
          <div>
            <Label htmlFor="unit">Input timestamp is in:</Label>
            <select
              id="unit"
              value={unit}
              onChange={(e) => {
                setUnit(e.target.value as 'seconds' | 'milliseconds');
                convertEpochToDate(input);
              }}
              className="w-full mt-2 px-3 py-2 border rounded"
            >
              <option value="seconds">Seconds (Unix timestamp)</option>
              <option value="milliseconds">Milliseconds (JavaScript timestamp)</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Common Timestamps */}
      <Card>
        <CardHeader>
          <CardTitle>Common Timestamps</CardTitle>
          <CardDescription>Click any timestamp to convert it</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {commonTimestamps.map((timestamp, index) => (
              <div
                key={index}
                className="p-3 border rounded cursor-pointer hover:bg-muted transition-colors"
                onClick={() => {
                  setInput(timestamp.value);
                  convertEpochToDate(timestamp.value);
                }}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-semibold text-sm">{timestamp.name}</div>
                    <div className="font-mono text-xs text-muted-foreground">{timestamp.value}</div>
                  </div>
                  <div className="text-xs text-muted-foreground text-right">
                    {timestamp.description}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Documentation */}
      <CollapsibleGuide title="Epoch to Date Converter Guide">
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold mb-2">What is Unix Timestamp?</h4>
            <p className="text-sm text-muted-foreground">
              Unix timestamp (Epoch time) represents the number of seconds (or milliseconds) 
              that have elapsed since January 1, 1970, 00:00:00 UTC.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-2">Features:</h4>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
              <li>Converts Unix timestamps to human-readable dates</li>
              <li>Supports both seconds and milliseconds timestamps</li>
              <li>Shows multiple date formats and timezones</li>
              <li>Displays relative time (e.g., "2 days ago")</li>
              <li>Real-time current timestamp display</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-2">Timestamp Types:</h4>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
              <li><strong>Seconds:</strong> Standard Unix timestamp (10 digits)</li>
              <li><strong>Milliseconds:</strong> JavaScript timestamp (13 digits)</li>
              <li>Most systems use seconds, JavaScript uses milliseconds</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-2">Use Cases:</h4>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
              <li>Database timestamp analysis</li>
              <li>Log file investigation</li>
              <li>API response debugging</li>
              <li>System administration</li>
              <li>Data analysis and reporting</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-2">Tips:</h4>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
              <li>10-digit numbers are usually seconds</li>
              <li>13-digit numbers are usually milliseconds</li>
              <li>Unix timestamps are always in UTC</li>
              <li>Local time display depends on your browser's timezone</li>
            </ul>
          </div>
        </div>
      </CollapsibleGuide>
    </div>
  );
}