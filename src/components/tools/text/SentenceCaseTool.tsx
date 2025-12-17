'use client';

import { useState } from 'react';
import ToolLayout from '@/components/common/ToolLayout';
import InputBox from '@/components/common/InputBox';
import OutputBox from '@/components/common/OutputBox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import CollapsibleGuide from '@/components/common/CollapsibleGuide';

export default function SentenceCaseTool() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [preserveAcronyms, setPreserveAcronyms] = useState(true);
  const [fixDoubleSpaces, setFixDoubleSpaces] = useState(true);
  const [stats, setStats] = useState({ sentences: 0, fixes: 0 });

  const fixSentenceCase = (text: string) => {
    if (!text.trim()) {
      setOutput('');
      setStats({ sentences: 0, fixes: 0 });
      return;
    }

    let result = text;
    let fixCount = 0;

    // Fix double spaces if option is enabled
    if (fixDoubleSpaces) {
      const beforeSpaceFix = result;
      result = result.replace(/\s+/g, ' ');
      if (result !== beforeSpaceFix) fixCount++;
    }

    // Convert to lowercase first, but preserve acronyms if option is enabled
    if (preserveAcronyms) {
      // Find and temporarily replace acronyms (2+ consecutive uppercase letters)
      const acronyms: string[] = [];
      result = result.replace(/\b[A-Z]{2,}\b/g, (match) => {
        const placeholder = `__ACRONYM_${acronyms.length}__`;
        acronyms.push(match);
        return placeholder;
      });
      
      // Convert to lowercase
      result = result.toLowerCase();
      
      // Restore acronyms
      acronyms.forEach((acronym, index) => {
        result = result.replace(`__acronym_${index}__`, acronym);
      });
    } else {
      result = result.toLowerCase();
    }

    // Capitalize first letter of text
    if (result.length > 0) {
      result = result.charAt(0).toUpperCase() + result.slice(1);
      fixCount++;
    }

    // Capitalize after sentence endings (. ! ?)
    const sentencePattern = /([.!?]\s*)([a-z])/g;
    const beforeSentenceFix = result;
    result = result.replace(sentencePattern, (match, punctuation, letter) => {
      return punctuation + letter.toUpperCase();
    });
    
    if (result !== beforeSentenceFix) fixCount++;

    // Capitalize after line breaks
    const lineBreakPattern = /(\n\s*)([a-z])/g;
    const beforeLineBreakFix = result;
    result = result.replace(lineBreakPattern, (match, lineBreak, letter) => {
      return lineBreak + letter.toUpperCase();
    });
    
    if (result !== beforeLineBreakFix) fixCount++;

    // Capitalize "I" when it's a standalone word
    const iPattern = /\b(i)\b/g;
    const beforeIFix = result;
    result = result.replace(iPattern, 'I');
    
    if (result !== beforeIFix) fixCount++;

    // Count sentences
    const sentenceCount = (result.match(/[.!?]+/g) || []).length;

    setOutput(result);
    setStats({ sentences: sentenceCount, fixes: fixCount });
  };

  const handleInputChange = (value: string) => {
    setInput(value);
    fixSentenceCase(value);
  };

  const handlePreserveAcronymsChange = (checked: boolean) => {
    setPreserveAcronyms(checked);
    fixSentenceCase(input);
  };

  const handleFixDoubleSpacesChange = (checked: boolean) => {
    setFixDoubleSpaces(checked);
    fixSentenceCase(input);
  };

  const handleExample = () => {
    const example = `hello world! this is a test sentence. what about this one? here's another sentence.

this is a new paragraph. i think it looks good. NASA and FBI are acronyms. this should be capitalized too.

multiple    spaces    should    be    fixed. final sentence here!`;
    setInput(example);
    fixSentenceCase(example);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Sentence Case Options</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="preserveAcronyms"
                checked={preserveAcronyms}
                onCheckedChange={handlePreserveAcronymsChange}
              />
              <Label htmlFor="preserveAcronyms">Preserve acronyms (NASA, FBI, etc.)</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox
                id="fixDoubleSpaces"
                checked={fixDoubleSpaces}
                onCheckedChange={handleFixDoubleSpacesChange}
              />
              <Label htmlFor="fixDoubleSpaces">Fix multiple spaces</Label>
            </div>
          </div>
        </CardContent>
      </Card>

      <ToolLayout>
        <InputBox
          title="Text to Fix"
          value={input}
          onChange={handleInputChange}
          placeholder="Enter text with incorrect capitalization..."
          rows={10}
          example="Load example text"
          onExample={handleExample}
        />
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-semibold">Fixed Text</h3>
            {stats.fixes > 0 && (
              <Badge variant="secondary">{stats.fixes} fixes applied</Badge>
            )}
            {stats.sentences > 0 && (
              <Badge variant="outline">{stats.sentences} sentences</Badge>
            )}
          </div>
          <OutputBox
            title="Result"
            value={output}
            placeholder="Fixed text will appear here..."
            rows={10}
          />
        </div>
      </ToolLayout>

      {/* Documentation */}
      <CollapsibleGuide title="Sentence Case Fixer Guide">
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold mb-2">What it fixes:</h4>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
              <li>Capitalizes the first letter of each sentence</li>
              <li>Capitalizes after periods, exclamation marks, and question marks</li>
              <li>Capitalizes the first letter after line breaks</li>
              <li>Capitalizes standalone "I" pronouns</li>
              <li>Preserves acronyms (optional)</li>
              <li>Fixes multiple consecutive spaces (optional)</li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-2">Features:</h4>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
              <li>Intelligent acronym detection and preservation</li>
              <li>Handles multiple sentence endings</li>
              <li>Works with paragraphs and line breaks</li>
              <li>Counts sentences and fixes applied</li>
              <li>Real-time processing as you type</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-2">Use cases:</h4>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
              <li>Fix text copied from sources with poor formatting</li>
              <li>Correct all-caps or all-lowercase text</li>
              <li>Prepare text for professional documents</li>
              <li>Clean up social media posts</li>
              <li>Format transcribed text or speech-to-text output</li>
              <li>Standardize capitalization in content</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-2">Examples of fixes:</h4>
            <div className="space-y-2 text-sm">
              <div>
                <strong>Before:</strong> "hello world. this is a test. i think it works."
              </div>
              <div>
                <strong>After:</strong> "Hello world. This is a test. I think it works."
              </div>
            </div>
          </div>
        </div>
      </CollapsibleGuide>
    </div>
  );
}