'use client';

import { useState } from 'react';
import ToolLayout from '@/components/common/ToolLayout';
import InputBox from '@/components/common/InputBox';
import OutputBox from '@/components/common/OutputBox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import CollapsibleGuide from '@/components/common/CollapsibleGuide';

export default function CssValidatorTool() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [issues, setIssues] = useState<string[]>([]);

  const validateCss = (css: string) => {
    if (!css.trim()) {
      setOutput('');
      setIsValid(null);
      setIssues([]);
      return;
    }

    const foundIssues: string[] = [];
    let valid = true;

    try {
      // Basic CSS syntax validation
      const lines = css.split('\n');
      
      // Check for basic syntax issues
      let braceCount = 0;
      let inRule = false;
      
      lines.forEach((line, lineNum) => {
        const trimmedLine = line.trim();
        if (!trimmedLine || trimmedLine.startsWith('/*')) return;
        
        // Count braces
        const openBraces = (trimmedLine.match(/{/g) || []).length;
        const closeBraces = (trimmedLine.match(/}/g) || []).length;
        braceCount += openBraces - closeBraces;
        
        // Check for unclosed strings
        const singleQuotes = (trimmedLine.match(/'/g) || []).length;
        const doubleQuotes = (trimmedLine.match(/"/g) || []).length;
        
        if (singleQuotes % 2 !== 0) {
          foundIssues.push(`Line ${lineNum + 1}: Unclosed single quote`);
          valid = false;
        }
        
        if (doubleQuotes % 2 !== 0) {
          foundIssues.push(`Line ${lineNum + 1}: Unclosed double quote`);
          valid = false;
        }
        
        // Check for missing semicolons in property declarations
        if (trimmedLine.includes(':') && !trimmedLine.includes('{') && !trimmedLine.includes('}')) {
          if (!trimmedLine.endsWith(';') && !trimmedLine.endsWith('{')) {
            foundIssues.push(`Line ${lineNum + 1}: Missing semicolon after property`);
          }
        }
        
        // Check for invalid property names (basic check)
        const propertyMatch = trimmedLine.match(/^([a-zA-Z-]+):/);
        if (propertyMatch) {
          const property = propertyMatch[1];
          if (property.includes('_')) {
            foundIssues.push(`Line ${lineNum + 1}: CSS properties should use hyphens, not underscores`);
          }
        }
      });
      
      // Check for unmatched braces
      if (braceCount !== 0) {
        foundIssues.push(`Unmatched braces: ${braceCount > 0 ? 'missing closing' : 'extra closing'} brace(s)`);
        valid = false;
      }
      
      // Check for empty selectors
      if (css.includes('{}')) {
        foundIssues.push('Empty rule sets found');
      }
      
      setIsValid(valid && foundIssues.length === 0);
      setIssues(foundIssues);
      
      if (valid && foundIssues.length === 0) {
        setOutput('✓ Valid CSS - No syntax errors found');
      } else {
        setOutput(`✗ CSS has ${foundIssues.length} issue(s)`);
      }
      
    } catch (error) {
      setIsValid(false);
      setOutput('✗ Error parsing CSS');
      setIssues(['Unable to parse CSS content']);
    }
  };

  const handleInputChange = (value: string) => {
    setInput(value);
    validateCss(value);
  };

  const handleExample = () => {
    const example = `/* Valid CSS example */
body {
  margin: 0;
  padding: 0;
  font-family: Arial, sans-serif;
  background-color: #ffffff;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.header {
  background: #333;
  color: white;
  padding: 10px 20px;
  border-radius: 5px;
}

.button:hover {
  background-color: #0056b3;
  transition: background-color 0.3s ease;
}`;
    setInput(example);
    validateCss(example);
  };

  return (
    <div className="space-y-6">
      <ToolLayout>
        <InputBox
          title="CSS to Validate"
          value={input}
          onChange={handleInputChange}
          placeholder="Paste your CSS code here..."
          example="Load example CSS"
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

          {issues.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base text-destructive">Issues Found</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-1 text-sm">
                  {issues.map((issue, index) => (
                    <li key={index} className="text-destructive">
                      • {issue}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
        </div>
      </ToolLayout>

      {/* Documentation */}
      <CollapsibleGuide title="CSS Validator Guide">
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold mb-2">What it validates:</h4>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
              <li>Balanced braces and brackets</li>
              <li>Proper semicolon usage</li>
              <li>Unclosed strings and quotes</li>
              <li>Basic property name format</li>
              <li>Empty rule sets</li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-2">Common CSS errors detected:</h4>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
              <li>Missing semicolons after properties</li>
              <li>Unmatched opening/closing braces</li>
              <li>Unclosed string literals</li>
              <li>Invalid property names with underscores</li>
              <li>Empty CSS rules</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-2">Limitations:</h4>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
              <li>Basic syntax validation only</li>
              <li>Does not validate property values</li>
              <li>Does not check CSS3 compatibility</li>
              <li>Does not validate vendor prefixes</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-2">Tips:</h4>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
              <li>Use this for basic syntax checking</li>
              <li>Always test CSS in target browsers</li>
              <li>Consider using CSS linters for advanced validation</li>
              <li>Check vendor prefix requirements</li>
            </ul>
          </div>
        </div>
      </CollapsibleGuide>
    </div>
  );
}