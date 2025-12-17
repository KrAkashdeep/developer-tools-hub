'use client';

import { useState } from 'react';
import ToolLayout from '@/components/common/ToolLayout';
import InputBox from '@/components/common/InputBox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { IconCheck, IconX, IconAlertTriangle, IconInfoCircle } from '@tabler/icons-react';
import CollapsibleGuide from '@/components/common/CollapsibleGuide';

interface ValidationError {
  type: 'error' | 'warning' | 'info';
  message: string;
  line?: number;
  column?: number;
}

export default function HtmlValidatorTool() {
  const [input, setInput] = useState('');
  const [errors, setErrors] = useState<ValidationError[]>([]);
  const [isValid, setIsValid] = useState<boolean | null>(null);

  const validateHtml = (html: string) => {
    if (!html.trim()) {
      setErrors([]);
      setIsValid(null);
      return;
    }

    const validationErrors: ValidationError[] = [];

    // Basic HTML validation rules
    const checks = [
      // DOCTYPE check
      {
        test: () => !html.toLowerCase().includes('<!doctype'),
        error: { type: 'warning' as const, message: 'Missing DOCTYPE declaration' }
      },
      // HTML tag check
      {
        test: () => !/<html[^>]*>/i.test(html),
        error: { type: 'error' as const, message: 'Missing <html> opening tag' }
      },
      // Head tag check
      {
        test: () => !/<head[^>]*>/i.test(html),
        error: { type: 'error' as const, message: 'Missing <head> section' }
      },
      // Body tag check
      {
        test: () => !/<body[^>]*>/i.test(html),
        error: { type: 'error' as const, message: 'Missing <body> section' }
      },
      // Title tag check
      {
        test: () => !/<title[^>]*>.*<\/title>/i.test(html),
        error: { type: 'warning' as const, message: 'Missing <title> tag in head section' }
      },
      // Meta charset check
      {
        test: () => !/<meta[^>]*charset[^>]*>/i.test(html),
        error: { type: 'warning' as const, message: 'Missing charset meta tag' }
      }
    ];

    checks.forEach(check => {
      if (check.test()) {
        validationErrors.push(check.error);
      }
    });

    // Check for unclosed tags
    const openTags = html.match(/<[^\/][^>]*>/g) || [];
    const closeTags = html.match(/<\/[^>]*>/g) || [];
    
    const selfClosingTags = ['img', 'br', 'hr', 'input', 'meta', 'link', 'area', 'base', 'col', 'embed', 'source', 'track', 'wbr'];
    
    openTags.forEach(tag => {
      const tagName = tag.match(/<(\w+)/)?.[1]?.toLowerCase();
      if (tagName && !selfClosingTags.includes(tagName) && !tag.endsWith('/>')) {
        const closeTag = `</${tagName}>`;
        if (!html.toLowerCase().includes(closeTag.toLowerCase())) {
          validationErrors.push({
            type: 'error',
            message: `Unclosed tag: ${tagName}`
          });
        }
      }
    });

    // Check for invalid nesting
    if (/<p[^>]*>.*<div/i.test(html)) {
      validationErrors.push({
        type: 'error',
        message: 'Invalid nesting: <div> inside <p> tag'
      });
    }

    // Check for duplicate IDs
    const idMatches = html.match(/id\s*=\s*["']([^"']+)["']/gi) || [];
    const ids = idMatches.map(match => match.match(/id\s*=\s*["']([^"']+)["']/i)?.[1]).filter(Boolean);
    const duplicateIds = ids.filter((id, index) => ids.indexOf(id) !== index);
    
    duplicateIds.forEach(id => {
      validationErrors.push({
        type: 'error',
        message: `Duplicate ID: "${id}"`
      });
    });

    // Check for accessibility issues
    if (/<img(?![^>]*alt\s*=)/i.test(html)) {
      validationErrors.push({
        type: 'warning',
        message: 'Images should have alt attributes for accessibility'
      });
    }

    if (/<input(?![^>]*type\s*=\s*["'](?:submit|button|hidden)["'])(?![^>]*aria-label)(?![^>]*<label)/i.test(html)) {
      validationErrors.push({
        type: 'warning',
        message: 'Form inputs should have associated labels'
      });
    }

    setErrors(validationErrors);
    setIsValid(validationErrors.filter(e => e.type === 'error').length === 0);
  };

  const handleInputChange = (value: string) => {
    setInput(value);
    validateHtml(value);
  };

  const handleExample = () => {
    const example = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sample HTML Document</title>
</head>
<body>
    <header>
        <h1>Welcome to My Website</h1>
        <nav>
            <ul>
                <li><a href="#home">Home</a></li>
                <li><a href="#about">About</a></li>
                <li><a href="#contact">Contact</a></li>
            </ul>
        </nav>
    </header>
    
    <main>
        <section id="home">
            <h2>Home Section</h2>
            <p>This is a sample paragraph with <strong>bold text</strong> and <em>italic text</em>.</p>
            <img src="image.jpg" alt="Sample image description">
        </section>
        
        <section id="about">
            <h2>About Section</h2>
            <form>
                <label for="name">Name:</label>
                <input type="text" id="name" name="name" required>
                
                <label for="email">Email:</label>
                <input type="email" id="email" name="email" required>
                
                <button type="submit">Submit</button>
            </form>
        </section>
    </main>
    
    <footer>
        <p>&copy; 2025 My Website. All rights reserved.</p>
    </footer>
</body>
</html>`;
    setInput(example);
    validateHtml(example);
  };

  const getValidationSummary = () => {
    const errorCount = errors.filter(e => e.type === 'error').length;
    const warningCount = errors.filter(e => e.type === 'warning').length;
    const infoCount = errors.filter(e => e.type === 'info').length;

    return { errorCount, warningCount, infoCount };
  };

  const { errorCount, warningCount, infoCount } = getValidationSummary();

  return (
    <div className="space-y-4 sm:space-y-6">
      <ToolLayout>
        <InputBox
          title="HTML Code"
          value={input}
          onChange={handleInputChange}
          placeholder="Paste your HTML code here to validate..."
          rows={15}
          example="Load example HTML"
          onExample={handleExample}
        />
        
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Validation Results</h3>
          
          {/* Validation Summary */}
          {input && (
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  {isValid ? (
                    <IconCheck className="h-5 w-5 text-green-500" />
                  ) : (
                    <IconX className="h-5 w-5 text-red-500" />
                  )}
                  <CardTitle className="text-base">
                    {isValid ? 'Valid HTML' : 'Invalid HTML'}
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex flex-wrap gap-2">
                  {errorCount > 0 && (
                    <Badge variant="destructive" className="text-xs">
                      {errorCount} Error{errorCount !== 1 ? 's' : ''}
                    </Badge>
                  )}
                  {warningCount > 0 && (
                    <Badge variant="secondary" className="text-xs">
                      {warningCount} Warning{warningCount !== 1 ? 's' : ''}
                    </Badge>
                  )}
                  {infoCount > 0 && (
                    <Badge variant="outline" className="text-xs">
                      {infoCount} Info
                    </Badge>
                  )}
                  {errors.length === 0 && (
                    <Badge variant="outline" className="text-green-600 text-xs">
                      No issues found
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Validation Errors */}
          {errors.length > 0 && (
            <div className="space-y-2">
              {errors.map((error, index) => (
                <Alert key={index} className={`${
                  error.type === 'error' ? 'border-red-200 bg-red-50 dark:bg-red-900/20' :
                  error.type === 'warning' ? 'border-yellow-200 bg-yellow-50 dark:bg-yellow-900/20' :
                  'border-blue-200 bg-blue-50 dark:bg-blue-900/20'
                }`}>
                  <div className="flex items-start gap-2">
                    {error.type === 'error' && <IconX className="h-4 w-4 text-red-500 mt-0.5" />}
                    {error.type === 'warning' && <IconAlertTriangle className="h-4 w-4 text-yellow-500 mt-0.5" />}
                    {error.type === 'info' && <IconInfoCircle className="h-4 w-4 text-blue-500 mt-0.5" />}
                    <AlertDescription className="text-sm">
                      <span className="font-medium capitalize">{error.type}:</span> {error.message}
                      {error.line && <span className="text-muted-foreground"> (Line {error.line})</span>}
                    </AlertDescription>
                  </div>
                </Alert>
              ))}
            </div>
          )}

          {!input && (
            <Card>
              <CardContent className="text-center py-8">
                <p className="text-muted-foreground">Enter HTML code to validate</p>
              </CardContent>
            </Card>
          )}
        </div>
      </ToolLayout>

      {/* Documentation */}
      <CollapsibleGuide title="HTML Validator Guide" description="Validate your HTML markup for errors, warnings, and best practices">
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-2">What it checks:</h4>
              <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                <li>DOCTYPE declaration</li>
                <li>Required HTML structure (html, head, body)</li>
                <li>Unclosed tags</li>
                <li>Invalid tag nesting</li>
                <li>Duplicate IDs</li>
                <li>Basic accessibility issues</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-2">Validation levels:</h4>
              <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                <li><span className="text-red-500">Errors:</span> Must be fixed for valid HTML</li>
                <li><span className="text-yellow-500">Warnings:</span> Best practices and recommendations</li>
                <li><span className="text-blue-500">Info:</span> Additional suggestions</li>
              </ul>
            </div>
          </div>
        </div>
      </CollapsibleGuide>
    </div>
  );
}