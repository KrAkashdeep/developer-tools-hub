'use client';

import { useState } from 'react';
import ToolLayout from '@/components/common/ToolLayout';
import InputBox from '@/components/common/InputBox';
import OutputBox from '@/components/common/OutputBox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function EmailValidatorTool() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [isValid, setIsValid] = useState<boolean | null>(null);

  const validateEmail = (email: string) => {
    if (!email.trim()) {
      setOutput('');
      setIsValid(null);
      return;
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const valid = emailRegex.test(email.trim());
    
    setIsValid(valid);
    setOutput(valid ? 'Valid email address' : 'Invalid email address');
  };

  const handleInputChange = (value: string) => {
    setInput(value);
    validateEmail(value);
  };

  const handleExample = () => {
    const example = 'user@example.com';
    setInput(example);
    validateEmail(example);
  };

  return (
    <div className="space-y-6">
      <ToolLayout>
        <InputBox
          title="Email Address"
          value={input}
          onChange={handleInputChange}
          placeholder="Enter email address to validate..."
          type="input"
          example="Load example email"
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
        </div>
      </ToolLayout>
      <Card>
        <CardHeader>
          <CardTitle>Email Validator</CardTitle>
        </CardHeader>
        <CardContent>
          <CardDescription>
            Validates email addresses using RFC-compliant regex patterns.
          </CardDescription>
        </CardContent>
      </Card>
    </div>
  );
}