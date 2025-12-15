'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Copy, Download, RotateCcw } from 'lucide-react';
import Breadcrumb from '@/components/common/Breadcrumb';
import { Tool } from '@/lib/types';

interface ToolPageLayoutProps {
  tool: Tool;
  onProcess: (input: string, options?: any) => { output: string; error?: string };
  options?: React.ReactNode;
  placeholder?: string;
  outputPlaceholder?: string;
}

export function ToolPageLayout({ 
  tool, 
  onProcess, 
  options, 
  placeholder = "Enter your input here...",
  outputPlaceholder = "Output will appear here..."
}: ToolPageLayoutProps) {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState<string | undefined>();
  const [processingOptions, setProcessingOptions] = useState({});

  // Real-time processing - updates output immediately when input changes
  const processInput = useCallback((inputValue: string, options: any = {}) => {
    if (!inputValue.trim()) {
      setOutput('');
      setError(undefined);
      return;
    }

    try {
      const result = onProcess(inputValue, { ...processingOptions, ...options });
      setOutput(result.output);
      setError(result.error);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setOutput('');
    }
  }, [onProcess, processingOptions]);

  // Process input whenever it changes (real-time processing)
  useEffect(() => {
    processInput(input);
  }, [input, processInput]);

  const handleInputChange = (value: string) => {
    setInput(value);
  };

  const handleClearInput = () => {
    setInput('');
    // Output will be cleared automatically via useEffect
  };

  const handleCopyOutput = async () => {
    if (output) {
      await navigator.clipboard.writeText(output);
    }
  };

  const handleDownloadOutput = () => {
    if (output) {
      const blob = new Blob([output], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${tool.slug}-output.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl">
      {/* Breadcrumb Navigation */}
      <Breadcrumb 
        items={[
          { label: 'Home', href: '/' },
          { label: 'Tools', href: '/tools' },
          { label: tool.name, href: `/tools/${tool.slug}` }
        ]}
      />

      {/* Tool Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{tool.name}</h1>
        <p className="text-lg text-muted-foreground">{tool.description}</p>
      </div>

      {/* Main Tool Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Input Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Input
              <Button
                variant="outline"
                size="sm"
                onClick={handleClearInput}
                disabled={!input}
                data-testid="clear-input-button"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Clear
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              value={input}
              onChange={(e) => handleInputChange(e.target.value)}
              placeholder={placeholder}
              className="min-h-[300px] font-mono text-sm"
              data-testid="tool-input"
            />
          </CardContent>
        </Card>

        {/* Output Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Output
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCopyOutput}
                  disabled={!output}
                  data-testid="copy-output-button"
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Copy
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDownloadOutput}
                  disabled={!output}
                  data-testid="download-output-button"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {error ? (
              <div className="min-h-[300px] p-4 bg-destructive/10 border border-destructive/20 rounded-md">
                <p className="text-destructive font-medium mb-2">Error:</p>
                <p className="text-destructive text-sm" data-testid="error-message">{error}</p>
              </div>
            ) : (
              <Textarea
                value={output}
                readOnly
                placeholder={outputPlaceholder}
                className="min-h-[300px] font-mono text-sm bg-muted/50"
                data-testid="tool-output"
              />
            )}
          </CardContent>
        </Card>
      </div>

      {/* Options Panel */}
      {options && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Options</CardTitle>
            <CardDescription>Customize the tool behavior</CardDescription>
          </CardHeader>
          <CardContent>
            {options}
          </CardContent>
        </Card>
      )}

      {/* Examples Section */}
      {tool.examples && tool.examples.length > 0 && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Examples</CardTitle>
            <CardDescription>Try these examples to get started</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {tool.examples.map((example, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <h4 className="font-medium mb-2">{example.description}</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-1">Input:</p>
                      <code className="block p-2 bg-muted rounded text-sm">{example.input}</code>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-1">Output:</p>
                      <code className="block p-2 bg-muted rounded text-sm">{example.output}</code>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-2"
                    onClick={() => setInput(example.input)}
                  >
                    Try this example
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}