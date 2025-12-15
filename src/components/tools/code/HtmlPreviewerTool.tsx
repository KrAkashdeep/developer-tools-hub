'use client';

import { useState, useRef } from 'react';
import ToolLayout from '@/components/common/ToolLayout';
import InputBox from '@/components/common/InputBox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { IconRefresh, IconExternalLink } from '@tabler/icons-react';

export default function HtmlPreviewerTool() {
  const [input, setInput] = useState('');
  const [safeMode, setSafeMode] = useState(true);
  const [showSource, setShowSource] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const sanitizeHtml = (html: string): string => {
    if (!safeMode) return html;

    // Remove potentially dangerous elements and attributes
    return html
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
      .replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, '')
      .replace(/<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi, '')
      .replace(/<form\b[^<]*(?:(?!<\/form>)<[^<]*)*<\/form>/gi, '')
      .replace(/on\w+\s*=\s*["'][^"']*["']/gi, '') // Remove event handlers
      .replace(/javascript:/gi, '') // Remove javascript: URLs
      .replace(/data:/gi, ''); // Remove data: URLs for security
  };

  const updatePreview = (html: string) => {
    if (!iframeRef.current) return;

    const sanitizedHtml = sanitizeHtml(html);
    const fullHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>HTML Preview</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            margin: 16px;
            color: #333;
        }
        * {
            box-sizing: border-box;
        }
    </style>
</head>
<body>
    ${sanitizedHtml}
</body>
</html>`;

    const blob = new Blob([fullHtml], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    iframeRef.current.src = url;
  };

  const handleInputChange = (value: string) => {
    setInput(value);
    updatePreview(value);
  };

  const handleSafeModeChange = (checked: boolean) => {
    setSafeMode(checked);
    updatePreview(input);
  };

  const refreshPreview = () => {
    updatePreview(input);
  };

  const openInNewTab = () => {
    if (!input.trim()) return;

    const sanitizedHtml = sanitizeHtml(input);
    const fullHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>HTML Preview</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            margin: 16px;
            color: #333;
        }
    </style>
</head>
<body>
    ${sanitizedHtml}
</body>
</html>`;

    const blob = new Blob([fullHtml], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
  };

  const handleExample = () => {
    const example = `<div style="max-width: 600px; margin: 0 auto; padding: 20px;">
    <h1 style="color: #2c3e50; text-align: center;">Welcome to HTML Preview</h1>
    
    <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 10px; margin: 20px 0;">
        <h2>Features</h2>
        <ul>
            <li>Real-time HTML preview</li>
            <li>Safe mode for security</li>
            <li>Responsive design</li>
            <li>Modern styling</li>
        </ul>
    </div>

    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin: 20px 0;">
        <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; border-left: 4px solid #007bff;">
            <h3 style="margin-top: 0; color: #007bff;">Card 1</h3>
            <p>This is a sample card with some content.</p>
        </div>
        
        <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; border-left: 4px solid #28a745;">
            <h3 style="margin-top: 0; color: #28a745;">Card 2</h3>
            <p>Another card with different styling.</p>
        </div>
    </div>

    <form style="background: #f8f9fa; padding: 20px; border-radius: 8px;">
        <h3>Sample Form</h3>
        <div style="margin-bottom: 15px;">
            <label style="display: block; margin-bottom: 5px; font-weight: bold;">Name:</label>
            <input type="text" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
        </div>
        <div style="margin-bottom: 15px;">
            <label style="display: block; margin-bottom: 5px; font-weight: bold;">Email:</label>
            <input type="email" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
        </div>
        <button type="button" style="background: #007bff; color: white; padding: 10px 20px; border: none; border-radius: 4px; cursor: pointer;">Submit</button>
    </form>
</div>`;
    setInput(example);
    updatePreview(example);
  };

  const getHtmlStats = () => {
    if (!input) return { elements: 0, characters: 0, lines: 0 };
    
    const elements = (input.match(/<[^>]+>/g) || []).length;
    const characters = input.length;
    const lines = input.split('\n').length;
    
    return { elements, characters, lines };
  };

  const stats = getHtmlStats();

  return (
    <div className="space-y-4 sm:space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Preview Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Settings - Mobile Responsive */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="safeMode"
                  checked={safeMode}
                  onCheckedChange={handleSafeModeChange}
                />
                <Label htmlFor="safeMode" className="text-sm">Safe mode (removes scripts)</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="showSource"
                  checked={showSource}
                  onCheckedChange={setShowSource}
                />
                <Label htmlFor="showSource" className="text-sm">Show source view</Label>
              </div>
            </div>
            
            {/* Action Buttons - Mobile Responsive */}
            <div className="flex flex-col sm:flex-row gap-2">
              <Button onClick={refreshPreview} size="sm" variant="outline" className="w-full sm:w-auto">
                <IconRefresh className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Refresh</span>
                <span className="sm:hidden">Refresh Preview</span>
              </Button>
              <Button onClick={openInNewTab} size="sm" variant="outline" className="w-full sm:w-auto">
                <IconExternalLink className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Open in Tab</span>
                <span className="sm:hidden">Open in New Tab</span>
              </Button>
            </div>
          </div>

          {/* Stats - Mobile Responsive */}
          {stats.elements > 0 && (
            <div className="flex flex-wrap gap-2 text-sm">
              <Badge variant="outline" className="text-xs">{stats.elements} HTML elements</Badge>
              <Badge variant="outline" className="text-xs">{stats.characters} characters</Badge>
              <Badge variant="outline" className="text-xs">{stats.lines} lines</Badge>
              <Badge variant={safeMode ? 'secondary' : 'destructive'} className="text-xs">
                {safeMode ? 'Safe Mode' : 'Unsafe Mode'}
              </Badge>
            </div>
          )}
        </CardContent>
      </Card>

      <ToolLayout>
        <InputBox
          title="HTML Code"
          value={input}
          onChange={handleInputChange}
          placeholder="Enter your HTML code here..."
          rows={15}
          example="Load example HTML"
          onExample={handleExample}
        />
        
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Live Preview</h3>
          
          <Card>
            <CardContent className="p-0">
              {showSource ? (
                <div className="p-4">
                  <pre className="bg-muted p-4 rounded text-sm overflow-auto max-h-64 sm:max-h-96">
                    <code>{sanitizeHtml(input)}</code>
                  </pre>
                </div>
              ) : (
                <iframe
                  ref={iframeRef}
                  className="w-full h-64 sm:h-80 lg:h-96 border-0 rounded"
                  title="HTML Preview"
                  sandbox="allow-same-origin"
                />
              )}
            </CardContent>
          </Card>
        </div>
      </ToolLayout>

      {/* Documentation */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base sm:text-lg">HTML Previewer Guide</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-3 text-sm sm:text-base">Features:</h4>
              <ul className="list-disc list-inside text-xs sm:text-sm text-muted-foreground space-y-1">
                <li>Real-time HTML preview as you type</li>
                <li>Safe mode removes potentially dangerous elements</li>
                <li>Source view to see sanitized HTML</li>
                <li>Open preview in new tab</li>
                <li>Responsive iframe preview</li>
                <li>HTML statistics and element counting</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-3 text-sm sm:text-base">Safe mode removes:</h4>
              <ul className="list-disc list-inside text-xs sm:text-sm text-muted-foreground space-y-1">
                <li>&lt;script&gt; tags and JavaScript code</li>
                <li>&lt;iframe&gt;, &lt;object&gt;, &lt;embed&gt; elements</li>
                <li>&lt;form&gt; elements for security</li>
                <li>Event handlers (onclick, onload, etc.)</li>
                <li>javascript: and data: URLs</li>
              </ul>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-3 text-sm sm:text-base">Use cases:</h4>
              <ul className="list-disc list-inside text-xs sm:text-sm text-muted-foreground space-y-1">
                <li>Test HTML snippets and components</li>
                <li>Preview email templates</li>
                <li>Prototype web layouts</li>
                <li>Learn HTML and CSS</li>
                <li>Debug HTML rendering issues</li>
                <li>Create HTML documentation</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-3 text-sm sm:text-base">Tips:</h4>
              <ul className="list-disc list-inside text-xs sm:text-sm text-muted-foreground space-y-1">
                <li>Use inline CSS for styling in the preview</li>
                <li>Keep safe mode enabled when testing untrusted HTML</li>
                <li>Use the source view to see what was sanitized</li>
                <li>Open in new tab for full-screen testing</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}