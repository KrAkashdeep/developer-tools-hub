'use client';

import { useState, useMemo } from 'react';
import ToolLayout from '@/components/common/ToolLayout';
import InputBox from '@/components/common/InputBox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';

interface RegexMatch {
  match: string;
  index: number;
  groups: string[];
}

export default function RegexTesterTool() {
  const [pattern, setPattern] = useState('');
  const [testString, setTestString] = useState('');
  const [flags, setFlags] = useState({
    global: true,
    ignoreCase: false,
    multiline: false,
    dotAll: false,
    unicode: false,
    sticky: false
  });

  const regexResult = useMemo(() => {
    if (!pattern || !testString) {
      return { matches: [], isValid: true, error: '' };
    }

    try {
      const flagString = Object.entries(flags)
        .filter(([_, enabled]) => enabled)
        .map(([flag, _]) => {
          switch (flag) {
            case 'global': return 'g';
            case 'ignoreCase': return 'i';
            case 'multiline': return 'm';
            case 'dotAll': return 's';
            case 'unicode': return 'u';
            case 'sticky': return 'y';
            default: return '';
          }
        })
        .join('');

      const regex = new RegExp(pattern, flagString);
      const matches: RegexMatch[] = [];

      if (flags.global) {
        let match;
        while ((match = regex.exec(testString)) !== null) {
          matches.push({
            match: match[0],
            index: match.index,
            groups: match.slice(1)
          });
          
          // Prevent infinite loop on zero-length matches
          if (match.index === regex.lastIndex) {
            regex.lastIndex++;
          }
        }
      } else {
        const match = regex.exec(testString);
        if (match) {
          matches.push({
            match: match[0],
            index: match.index,
            groups: match.slice(1)
          });
        }
      }

      return { matches, isValid: true, error: '' };
    } catch (error) {
      return { 
        matches: [], 
        isValid: false, 
        error: error instanceof Error ? error.message : 'Invalid regex pattern' 
      };
    }
  }, [pattern, testString, flags]);

  const handleFlagChange = (flag: keyof typeof flags) => {
    setFlags(prev => ({ ...prev, [flag]: !prev[flag] }));
  };

  const handleExamplePattern = () => {
    setPattern('\\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Z|a-z]{2,}\\b');
  };

  const handleExampleText = () => {
    setTestString(`Contact us at support@example.com or sales@company.org
You can also reach john.doe@gmail.com for technical questions.
Invalid emails: notanemail, @invalid.com, test@`);
  };

  // Highlight matches in the text
  const highlightedText = useMemo(() => {
    if (!testString || regexResult.matches.length === 0) {
      return testString;
    }

    let result = testString;
    let offset = 0;

    regexResult.matches.forEach((match) => {
      const start = match.index + offset;
      const end = start + match.match.length;
      const highlighted = `<mark class="bg-yellow-200 dark:bg-yellow-800">${match.match}</mark>`;
      result = result.slice(0, start) + highlighted + result.slice(end);
      offset += highlighted.length - match.match.length;
    });

    return result;
  }, [testString, regexResult.matches]);

  return (
    <div className="space-y-6">
      {/* Regex Pattern Input */}
      <Card>
        <CardHeader>
          <CardTitle>Regular Expression Pattern</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <div className="flex-1">
              <Input
                value={pattern}
                onChange={(e) => setPattern(e.target.value)}
                placeholder="Enter your regex pattern..."
                className="font-mono"
              />
            </div>
            <button
              onClick={handleExamplePattern}
              className="px-3 py-2 text-sm bg-muted hover:bg-muted/80 rounded"
            >
              Email Example
            </button>
          </div>

          {/* Flags */}
          <div>
            <Label className="text-sm font-medium mb-2 block">Flags:</Label>
            <div className="flex flex-wrap gap-4">
              {Object.entries(flags).map(([flag, enabled]) => (
                <div key={flag} className="flex items-center space-x-2">
                  <Checkbox
                    id={flag}
                    checked={enabled}
                    onCheckedChange={() => handleFlagChange(flag as keyof typeof flags)}
                  />
                  <Label htmlFor={flag} className="text-sm capitalize">
                    {flag === 'ignoreCase' ? 'Ignore Case (i)' :
                     flag === 'global' ? 'Global (g)' :
                     flag === 'multiline' ? 'Multiline (m)' :
                     flag === 'dotAll' ? 'Dot All (s)' :
                     flag === 'unicode' ? 'Unicode (u)' :
                     flag === 'sticky' ? 'Sticky (y)' : flag}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Pattern Status */}
          <div className="flex items-center gap-2">
            <Badge variant={regexResult.isValid ? 'secondary' : 'destructive'}>
              {regexResult.isValid ? 'Valid Pattern' : 'Invalid Pattern'}
            </Badge>
            {!regexResult.isValid && (
              <span className="text-sm text-destructive">{regexResult.error}</span>
            )}
          </div>
        </CardContent>
      </Card>

      <ToolLayout>
        <InputBox
          title="Test String"
          value={testString}
          onChange={setTestString}
          placeholder="Enter text to test against your regex..."
          rows={10}
          example="Load sample text"
          onExample={handleExampleText}
        />
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Results</h3>
            <Badge variant="outline">
              {regexResult.matches.length} match{regexResult.matches.length !== 1 ? 'es' : ''}
            </Badge>
          </div>

          {/* Highlighted Text */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Text with Matches Highlighted</CardTitle>
            </CardHeader>
            <CardContent>
              <div 
                className="p-3 bg-muted rounded font-mono text-sm whitespace-pre-wrap min-h-[200px]"
                dangerouslySetInnerHTML={{ __html: highlightedText }}
              />
            </CardContent>
          </Card>

          {/* Match Details */}
          {regexResult.matches.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Match Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {regexResult.matches.map((match, index) => (
                    <div key={index} className="p-3 bg-muted rounded">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline">Match {index + 1}</Badge>
                        <span className="font-mono text-sm">{match.match}</span>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Position: {match.index} - {match.index + match.match.length - 1}
                      </div>
                      {match.groups.length > 0 && (
                        <div className="text-sm text-muted-foreground">
                          Groups: {match.groups.map((group, i) => (
                            <span key={i} className="font-mono">
                              {i > 0 && ', '}${i + 1}: "{group}"
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </ToolLayout>

      {/* Documentation */}
      <Card>
        <CardHeader>
          <CardTitle>Regex Tester Guide</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-semibold mb-2">Common Patterns:</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between items-center p-2 bg-muted rounded">
                <code>\\d+</code>
                <span className="text-muted-foreground">One or more digits</span>
              </div>
              <div className="flex justify-between items-center p-2 bg-muted rounded">
                <code>[a-zA-Z]+</code>
                <span className="text-muted-foreground">One or more letters</span>
              </div>
              <div className="flex justify-between items-center p-2 bg-muted rounded">
                <code>\\w+@\\w+\\.\\w+</code>
                <span className="text-muted-foreground">Simple email pattern</span>
              </div>
              <div className="flex justify-between items-center p-2 bg-muted rounded">
                <code>^https?://</code>
                <span className="text-muted-foreground">URL starting with http/https</span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-2">Flags Explanation:</h4>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
              <li><strong>Global (g):</strong> Find all matches, not just the first</li>
              <li><strong>Ignore Case (i):</strong> Case-insensitive matching</li>
              <li><strong>Multiline (m):</strong> ^ and $ match line breaks</li>
              <li><strong>Dot All (s):</strong> . matches newline characters</li>
              <li><strong>Unicode (u):</strong> Enable Unicode support</li>
              <li><strong>Sticky (y):</strong> Match only from lastIndex position</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}