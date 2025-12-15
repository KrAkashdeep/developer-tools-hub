'use client';

import { useState, useEffect } from 'react';
import ToolLayout from '@/components/common/ToolLayout';
import InputBox from '@/components/common/InputBox';
import OutputBox from '@/components/common/OutputBox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import CopyButton from '@/components/common/CopyButton';

export default function DateToEpochTool() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [currentTime, setCurrentTime] = useState('');
  const [currentEpoch, setCurrentEpoch] = useState('');

  // Update current time every second
  useEffect(() => {
    const updateCurrentTime = () => {
      const now = new Date();
      setCurrentTime(now.toISOString());
      setCurrentEpoch(Math.floor(now.getTime() / 1000).toString());
    };

    updateCurrentTime();
    const interval = setInterval(updateCurrentTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const convertDateToEpoch = (dateString: string) => {
    if (!dateString.trim()) {
      setOutput('');
      return;
    }

    try {
      const date = new Date(dateString);
      
      if (isNaN(date.getTime())) {
        setOutput('Error: Invalid date format');
        return;
      }

      const epochSeconds = Math.floor(date.getTime() / 1000);
      const epochMilliseconds = date.getTime();

      const result = `Unix Timestamp (seconds): ${epochSeconds}
Unix Timestamp (milliseconds): ${epochMilliseconds}

Date Information:
- ISO String: ${date.toISOString()}
- UTC String: ${date.toUTCString()}
- Local String: ${date.toString()}
- Date Only: ${date.toDateString()}
- Time Only: ${date.toTimeString()}

Timezone Information:
- Timezone Offset: ${date.getTimezoneOffset()} minutes
- Local Timezone: ${Intl.DateTimeFormat().resolvedOptions().timeZone}`;

      setOutput(result);
    } catch (error) {
      setOutput(`Error: ${error instanceof Error ? error.message : 'Invalid date'}`);
    }
  };

  const handleInputChange = (value: string) => {
    setInput(value);
    convertDateToEpoch(value);
  };

  const handleExample = () => {
    const example = '2025-12-11T10:30:00Z';
    setInput(example);
    convertDateToEpoch(example);
  };

  const useCurrentTime = () => {
    const now = new Date().toISOString();
    setInput(now);
    convertDateToEpoch(now);
  };

  const commonFormats = [
    { name: 'ISO 8601', example: '2025-12-11T10:30:00Z' },
    { name: 'ISO with timezone', example: '2025-12-11T10:30:00+05:30' },
    { name: 'Date only', example: '2025-12-11' },
    { name: 'US format', example: '12/11/2025' },
    { name: 'European format', example: '11/12/2025' },
    { name: 'Long format', example: 'December 11, 2025 10:30:00' },
    { name: 'RFC 2822', example: 'Wed, 11 Dec 2025 10:30:00 GMT' },
  ];

  return (
    <div className="space-y-6">
      <ToolLayout>
        <InputBox
          title="Date/Time to Convert"
          value={input}
          onChange={handleInputChange}
          placeholder="Enter date/time (e.g., 2025-12-11T10:30:00Z, December 11, 2025, 12/11/2025)..."
          example="Load example date"
          onExample={handleExample}
        />
        
        <OutputBox
          title="Unix Timestamp & Details"
          value={output}
          placeholder="Unix timestamp and date details will appear here..."
          rows={12}
        />
      </ToolLayout>

      {/* Current Time Display */}
      <Card>
        <CardHeader>
          <CardTitle>Current Time</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-muted rounded">
            <div>
              <div className="font-semibold">Current Date/Time</div>
              <div className="font-mono text-sm">{currentTime}</div>
            </div>
            <CopyButton text={currentTime} />
          </div>
          
          <div className="flex items-center justify-between p-3 bg-muted rounded">
            <div>
              <div className="font-semibold">Current Unix Timestamp</div>
              <div className="font-mono text-sm">{currentEpoch}</div>
            </div>
            <CopyButton text={currentEpoch} />
          </div>
          
          <Button onClick={useCurrentTime} className="w-full">
            Use Current Time
          </Button>
        </CardContent>
      </Card>

      {/* Supported Formats */}
      <Card>
        <CardHeader>
          <CardTitle>Supported Date Formats</CardTitle>
          <CardDescription>Click any format to use it as an example</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {commonFormats.map((format, index) => (
              <div
                key={index}
                className="p-3 border rounded cursor-pointer hover:bg-muted transition-colors"
                onClick={() => {
                  setInput(format.example);
                  convertDateToEpoch(format.example);
                }}
              >
                <div className="font-semibold text-sm">{format.name}</div>
                <div className="font-mono text-xs text-muted-foreground">{format.example}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Documentation */}
      <Card>
        <CardHeader>
          <CardTitle>Date to Epoch Converter Guide</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-semibold mb-2">What is Unix Timestamp?</h4>
            <p className="text-sm text-muted-foreground">
              Unix timestamp (also known as Epoch time) is the number of seconds that have elapsed 
              since January 1, 1970, 00:00:00 UTC. It's a standard way to represent time in computing.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-2">Features:</h4>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
              <li>Converts various date formats to Unix timestamp</li>
              <li>Shows both seconds and milliseconds timestamps</li>
              <li>Displays detailed date information</li>
              <li>Real-time current timestamp display</li>
              <li>Timezone information and handling</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-2">Supported Input Formats:</h4>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
              <li>ISO 8601: 2025-12-11T10:30:00Z</li>
              <li>Date only: 2025-12-11</li>
              <li>US format: 12/11/2025</li>
              <li>European format: 11/12/2025</li>
              <li>Long format: December 11, 2025 10:30:00</li>
              <li>RFC 2822: Wed, 11 Dec 2025 10:30:00 GMT</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-2">Use Cases:</h4>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
              <li>Database timestamp storage</li>
              <li>API date/time parameters</li>
              <li>Log file analysis</li>
              <li>System administration</li>
              <li>Data migration and synchronization</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-2">Tips:</h4>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
              <li>Use ISO 8601 format for unambiguous dates</li>
              <li>Include timezone information when possible</li>
              <li>Unix timestamps are always in UTC</li>
              <li>Milliseconds timestamps are used in JavaScript</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}