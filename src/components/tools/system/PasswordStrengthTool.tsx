'use client';

import { useState } from 'react';
import ToolLayout from '@/components/common/ToolLayout';
import InputBox from '@/components/common/InputBox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

export default function PasswordStrengthTool() {
  const [input, setInput] = useState('');
  const [strength, setStrength] = useState({ score: 0, level: '', color: '', feedback: [] as string[] });

  const checkPasswordStrength = (password: string) => {
    if (!password) {
      setStrength({ score: 0, level: '', color: '', feedback: [] });
      return;
    }

    let score = 0;
    const feedback: string[] = [];

    // Length check
    if (password.length >= 8) {
      score += 20;
    } else {
      feedback.push('Use at least 8 characters');
    }

    if (password.length >= 12) {
      score += 10;
    }

    // Lowercase letters
    if (/[a-z]/.test(password)) {
      score += 15;
    } else {
      feedback.push('Add lowercase letters');
    }

    // Uppercase letters
    if (/[A-Z]/.test(password)) {
      score += 15;
    } else {
      feedback.push('Add uppercase letters');
    }

    // Numbers
    if (/\d/.test(password)) {
      score += 15;
    } else {
      feedback.push('Add numbers');
    }

    // Special characters
    if (/[^a-zA-Z0-9]/.test(password)) {
      score += 15;
    } else {
      feedback.push('Add special characters');
    }

    // No repeated characters
    if (!/(..).*\1/.test(password)) {
      score += 10;
    } else {
      feedback.push('Avoid repeated patterns');
    }

    // Determine strength level
    let level = '';
    let color = '';
    
    if (score < 30) {
      level = 'Very Weak';
      color = 'text-red-500';
    } else if (score < 50) {
      level = 'Weak';
      color = 'text-orange-500';
    } else if (score < 70) {
      level = 'Fair';
      color = 'text-yellow-500';
    } else if (score < 85) {
      level = 'Good';
      color = 'text-blue-500';
    } else {
      level = 'Strong';
      color = 'text-green-500';
    }

    setStrength({ score, level, color, feedback });
  };

  const handleInputChange = (value: string) => {
    setInput(value);
    checkPasswordStrength(value);
  };

  const handleExample = () => {
    const example = 'MyStr0ng!P@ssw0rd';
    setInput(example);
    checkPasswordStrength(example);
  };

  return (
    <div className="space-y-6">
      <ToolLayout>
        <InputBox
          title="Password to Check"
          value={input}
          onChange={handleInputChange}
          placeholder="Enter password to check strength..."
          type="input"
          example="Load example password"
          onExample={handleExample}
        />
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Password Strength</h3>
            {strength.level && (
              <Badge variant="outline" className={strength.color}>
                {strength.level}
              </Badge>
            )}
          </div>

          {input && (
            <>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Strength Score</span>
                  <span>{strength.score}/100</span>
                </div>
                <Progress value={strength.score} className="h-2" />
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Password Analysis</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Length:</span>
                    <span>{input.length} characters</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Lowercase:</span>
                    <span>{/[a-z]/.test(input) ? '✓' : '✗'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Uppercase:</span>
                    <span>{/[A-Z]/.test(input) ? '✓' : '✗'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Numbers:</span>
                    <span>{/\d/.test(input) ? '✓' : '✗'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Special chars:</span>
                    <span>{/[^a-zA-Z0-9]/.test(input) ? '✓' : '✗'}</span>
                  </div>
                </CardContent>
              </Card>

              {strength.feedback.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Suggestions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="list-disc list-inside text-sm space-y-1">
                      {strength.feedback.map((item, index) => (
                        <li key={index}>{item}</li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}
            </>
          )}
        </div>
      </ToolLayout>

      <Card>
        <CardHeader>
          <CardTitle>Password Strength Checker</CardTitle>
        </CardHeader>
        <CardContent>
          <CardDescription>
            Analyzes password strength based on length, character variety, and common patterns. Provides suggestions for improvement.
          </CardDescription>
        </CardContent>
      </Card>
    </div>
  );
}