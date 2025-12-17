'use client';

import { useState } from 'react';
import ToolLayout from '@/components/common/ToolLayout';
import InputBox from '@/components/common/InputBox';
import OutputBox from '@/components/common/OutputBox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import CollapsibleGuide from '@/components/common/CollapsibleGuide';

export default function ExtractUrlsTool() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [urlCount, setUrlCount] = useState(0);
  const [removeDuplicates, setRemoveDuplicates] = useState(true);
  const [includeProtocol, setIncludeProtocol] = useState(false);

  const extractUrls = (text: string) => {
    if (!text.trim()) {
      setOutput('');
      setUrlCount(0);
      return;
    }

    // Comprehensive URL regex pattern
    const urlRegex = /(?:(?:https?|ftp|file):\/\/|www\.|ftp\.)(?:\([-A-Z0-9+&@#\/%=~_|$?!:,.]*\)|[-A-Z0-9+&@#\/%=~_|$?!:,.])*(?:\([-A-Z0-9+&@#\/%=~_|$?!:,.]*\)|[A-Z0-9+&@#\/%=~_|$])/gim;
    
    // Alternative pattern for URLs without protocol
    const urlWithoutProtocolRegex = /(?:www\.)?[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*\.[a-zA-Z]{2,}(?:\/[^\s]*)?/gim;

    let urls: string[] = [];

    // Extract URLs with protocols
    const urlsWithProtocol = text.match(urlRegex) || [];
    urls = [...urls, ...urlsWithProtocol];

    // Extract URLs without protocols if option is enabled
    if (includeProtocol) {
      const urlsWithoutProtocol = text.match(urlWithoutProtocolRegex) || [];
      // Filter out URLs that are already captured with protocol
      const newUrls = urlsWithoutProtocol.filter(url => 
        !urlsWithProtocol.some(protocolUrl => protocolUrl.includes(url))
      );
      urls = [...urls, ...newUrls];
    }

    // Clean up URLs
    urls = urls.map(url => {
      // Remove trailing punctuation that might be part of sentence
      return url.replace(/[.,;:!?]+$/, '');
    });

    // Remove duplicates if option is enabled
    if (removeDuplicates) {
      urls = [...new Set(urls)];
    }

    // Sort URLs alphabetically
    urls.sort();

    setOutput(urls.join('\n'));
    setUrlCount(urls.length);
  };

  const handleInputChange = (value: string) => {
    setInput(value);
    extractUrls(value);
  };

  const handleRemoveDuplicatesChange = (checked: boolean) => {
    setRemoveDuplicates(checked);
    extractUrls(input);
  };

  const handleIncludeProtocolChange = (checked: boolean) => {
    setIncludeProtocol(checked);
    extractUrls(input);
  };

  const handleExample = () => {
    const example = `Check out these websites:
- https://www.example.com for examples
- Visit http://github.com/user/repo for code
- Download from ftp://files.example.org/downloads
- Also see www.google.com and stackoverflow.com
- Email us at contact@company.com (not a URL)
- https://subdomain.example.co.uk/path/to/page?param=value#section
- The same link again: https://www.example.com
- Invalid: not-a-url or just-text.here`;
    setInput(example);
    extractUrls(example);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Extraction Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="removeDuplicates"
                checked={removeDuplicates}
                onCheckedChange={handleRemoveDuplicatesChange}
              />
              <Label htmlFor="removeDuplicates">Remove duplicates</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="includeProtocol"
                checked={includeProtocol}
                onCheckedChange={handleIncludeProtocolChange}
              />
              <Label htmlFor="includeProtocol">Include URLs without protocol (www.example.com)</Label>
            </div>
          </div>
        </CardContent>
      </Card>

      <ToolLayout>
        <InputBox
          title="Text with URLs"
          value={input}
          onChange={handleInputChange}
          placeholder="Paste text containing URLs..."
          rows={10}
          example="Load example text"
          onExample={handleExample}
        />
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-semibold">Extracted URLs</h3>
            <Badge variant="outline">{urlCount} found</Badge>
          </div>
          <OutputBox
            title="URLs"
            value={output}
            placeholder="Extracted URLs will appear here..."
            rows={10}
          />
        </div>
      </ToolLayout>

      {/* Documentation */}
      <CollapsibleGuide title="Extract URLs Tool Guide">
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold mb-2">What it extracts:</h4>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
              <li>URLs with protocols: http://, https://, ftp://, file://</li>
              <li>URLs starting with www.</li>
              <li>Domain names without protocol (optional)</li>
              <li>URLs with paths, parameters, and fragments</li>
              <li>International domain names and subdomains</li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-2">Features:</h4>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
              <li>Comprehensive URL pattern matching</li>
              <li>Automatic duplicate removal (optional)</li>
              <li>Include/exclude URLs without protocols</li>
              <li>Cleans trailing punctuation from URLs</li>
              <li>Alphabetical sorting of results</li>
              <li>Real-time extraction as you type</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-2">Use cases:</h4>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
              <li>Extract links from articles or documents</li>
              <li>Collect URLs from social media posts</li>
              <li>Parse URLs from log files</li>
              <li>Create link lists from web content</li>
              <li>Validate and organize URL collections</li>
              <li>SEO analysis and link auditing</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-2">Supported URL formats:</h4>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
              <li>https://www.example.com</li>
              <li>http://subdomain.example.org/path</li>
              <li>ftp://files.example.com/downloads</li>
              <li>www.example.com (if option enabled)</li>
              <li>example.com/page?param=value#section</li>
            </ul>
          </div>
        </div>
      </CollapsibleGuide>
    </div>
  );
}