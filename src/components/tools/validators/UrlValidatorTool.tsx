'use client';

import { useState } from 'react';
import ToolLayout from '@/components/common/ToolLayout';
import InputBox from '@/components/common/InputBox';
import OutputBox from '@/components/common/OutputBox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function UrlValidatorTool() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [urlInfo, setUrlInfo] = useState<any>(null);

  const validateUrl = (url: string) => {
    if (!url.trim()) {
      setOutput('');
      setIsValid(null);
      setUrlInfo(null);
      return;
    }

    try {
      const urlObj = new URL(url.trim());
      setIsValid(true);
      setUrlInfo({
        protocol: urlObj.protocol,
        hostname: urlObj.hostname,
        port: urlObj.port || 'default',
        pathname: urlObj.pathname,
        search: urlObj.search,
        hash: urlObj.hash
      });
      setOutput('Valid URL');
    } catch (err) {
      setIsValid(false);
      setUrlInfo(null);
      setOutput('Invalid URL format');
    }
  };

  const handleInputChange = (value: string) => {
    setInput(value);
    validateUrl(value);
  };

  const handleExample = () => {
    const example = 'https://www.example.com/path?param=value#section';
    setInput(example);
    validateUrl(example);
  };

  return (
    <div className="space-y-6">
      <ToolLayout>
        <InputBox
          title="URL to Validate"
          value={input}
          onChange={handleInputChange}
          placeholder="Enter URL to validate..."
          type="input"
          example="Load example URL"
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
          {urlInfo && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">URL Components</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Protocol:</span>
                  <span className="font-mono">{urlInfo.protocol}</span>
                </div>
                <div className="flex justify-between">
                  <span>Hostname:</span>
                  <span className="font-mono">{urlInfo.hostname}</span>
                </div>
                <div className="flex justify-between">
                  <span>Port:</span>
                  <span className="font-mono">{urlInfo.port}</span>
                </div>
                <div className="flex justify-between">
                  <span>Path:</span>
                  <span className="font-mono">{urlInfo.pathname}</span>
                </div>
                {urlInfo.search && (
                  <div className="flex justify-between">
                    <span>Query:</span>
                    <span className="font-mono">{urlInfo.search}</span>
                  </div>
                )}
                {urlInfo.hash && (
                  <div className="flex justify-between">
                    <span>Fragment:</span>
                    <span className="font-mono">{urlInfo.hash}</span>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </ToolLayout>
      <Card>
        <CardHeader>
          <CardTitle>URL Validator</CardTitle>
        </CardHeader>
        <CardContent>
          <CardDescription>
            Validates URL format and breaks down URL components.
          </CardDescription>
        </CardContent>
      </Card>
    </div>
  );
}