'use client';

import { useState } from 'react';
import { useScrollToOutput } from '@/hooks/useScrollToOutput';
import ToolLayout from '@/components/common/ToolLayout';
import InputBox from '@/components/common/InputBox';
import OutputBox from '@/components/common/OutputBox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function JsonValidatorTool() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [error, setError] = useState('');
  const scrollToOutput = useScrollToOutput();

  const validateJson = (jsonString: string) => {
    if (!jsonString.trim()) {
      setOutput('');
      setIsValid(null);
      setError('');
      return;
    }

    try {
      const parsed = JSON.parse(jsonString);
      setIsValid(true);
      setOutput('✓ Valid JSON');
      setError('');
      scrollToOutput();
    } catch (err) {
      setIsValid(false);
      setError(err instanceof Error ? err.message : 'Invalid JSON');
      setOutput('✗ Invalid JSON');
      scrollToOutput();
    }
  };

  const handleInputChange = (value: string) => {
    setInput(value);
    validateJson(value);
  };

  const handleExample = () => {
    const example = '{"name": "John", "age": 30, "city": "New York"}';
    setInput(example);
    validateJson(example);
  };

  return (
    <div className="space-y-6">
      <ToolLayout>
        <InputBox
          title="JSON to Validate"
          value={input}
          onChange={handleInputChange}
          placeholder="Paste your JSON here..."
          example="Load example JSON"
          onExample={handleExample}
        />
        <div className="space-y-4" data-output-section="true">
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
          {error && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base text-destructive">Error Details</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-destructive">{error}</p>
              </CardContent>
            </Card>
          )}
        </div>
      </ToolLayout>
      <Card>
        <CardHeader>
          <CardTitle>JSON Validator</CardTitle>
        </CardHeader>
        <CardContent>
          <CardDescription>
            Validates JSON syntax and structure. Shows detailed error messages for invalid JSON.
          </CardDescription>
        </CardContent>
      </Card>
    </div>
  );
}