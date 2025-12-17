'use client';

import { useState } from 'react';
import ToolLayout from '@/components/common/ToolLayout';
import InputBox from '@/components/common/InputBox';
import OutputBox from '@/components/common/OutputBox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import CollapsibleGuide from '@/components/common/CollapsibleGuide';

export default function FindReplaceTool() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [findText, setFindText] = useState('');
  const [replaceText, setReplaceText] = useState('');
  const [caseSensitive, setCaseSensitive] = useState(false);
  const [useRegex, setUseRegex] = useState(false);
  const [replaceCount, setReplaceCount] = useState(0);

  const performReplace = (text: string, find: string, replace: string) => {
    if (!text || !find) {
      setOutput(text);
      setReplaceCount(0);
      return;
    }

    try {
      let result = text;
      let count = 0;

      if (useRegex) {
        const flags = caseSensitive ? 'g' : 'gi';
        const regex = new RegExp(find, flags);
        const matches = text.match(regex);
        count = matches ? matches.length : 0;
        result = text.replace(regex, replace);
      } else {
        const searchValue = caseSensitive ? find : find.toLowerCase();
        const textToSearch = caseSensitive ? text : text.toLowerCase();
        
        let index = 0;
        while ((index = textToSearch.indexOf(searchValue, index)) !== -1) {
          count++;
          result = result.substring(0, index) + replace + result.substring(index + find.length);
          index += replace.length;
        }
      }

      setOutput(result);
      setReplaceCount(count);
    } catch (err) {
      setOutput('Error: Invalid regex pattern');
      setReplaceCount(0);
    }
  };

  const handleInputChange = (value: string) => {
    setInput(value);
    performReplace(value, findText, replaceText);
  };

  const handleFindChange = (value: string) => {
    setFindText(value);
    performReplace(input, value, replaceText);
  };

  const handleReplaceChange = (value: string) => {
    setReplaceText(value);
    performReplace(input, findText, value);
  };

  const handleCaseSensitiveChange = (checked: boolean) => {
    setCaseSensitive(checked);
    performReplace(input, findText, replaceText);
  };

  const handleRegexChange = (checked: boolean) => {
    setUseRegex(checked);
    performReplace(input, findText, replaceText);
  };

  const handleExample = () => {
    const example = `Hello world! This is a sample text.
Hello again! The world is beautiful.
World peace is important for everyone.`;
    const find = 'world';
    const replace = 'universe';
    
    setInput(example);
    setFindText(find);
    setReplaceText(replace);
    performReplace(example, find, replace);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Find & Replace Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="find">Find</Label>
              <Input
                id="find"
                value={findText}
                onChange={(e) => handleFindChange(e.target.value)}
                placeholder="Text to find..."
              />
            </div>
            <div>
              <Label htmlFor="replace">Replace with</Label>
              <Input
                id="replace"
                value={replaceText}
                onChange={(e) => handleReplaceChange(e.target.value)}
                placeholder="Replacement text..."
              />
            </div>
          </div>
          
          <div className="flex gap-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="caseSensitive"
                checked={caseSensitive}
                onCheckedChange={handleCaseSensitiveChange}
              />
              <Label htmlFor="caseSensitive">Case sensitive</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="useRegex"
                checked={useRegex}
                onCheckedChange={handleRegexChange}
              />
              <Label htmlFor="useRegex">Use regex</Label>
            </div>
          </div>
        </CardContent>
      </Card>

      <ToolLayout>
        <InputBox
          title="Original Text"
          value={input}
          onChange={handleInputChange}
          placeholder="Enter text to search and replace..."
          example="Load example text"
          onExample={handleExample}
        />
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-semibold">Result</h3>
            <Badge variant="outline">{replaceCount} replacements</Badge>
          </div>
          <OutputBox
            title="Modified Text"
            value={output}
            placeholder="Modified text will appear here..."
          />
        </div>
      </ToolLayout>

      <CollapsibleGuide title="Find & Replace Tool Guide">
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold mb-2">What it does:</h4>
            <p className="text-sm text-muted-foreground">
              Search and replace text with options for case sensitivity and regex patterns. 
              Shows the number of replacements made in real-time.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-2">Features:</h4>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
              <li>Case-sensitive or case-insensitive search</li>
              <li>Regular expression support</li>
              <li>Real-time replacement count</li>
              <li>Global replace (all occurrences)</li>
              <li>Preserves text formatting</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-2">Regex examples:</h4>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
              <li><code>\\d+</code> - Find all numbers</li>
              <li><code>\\b\\w+@\\w+\\.\\w+\\b</code> - Find email addresses</li>
              <li><code>^.*error.*$</code> - Find lines containing "error"</li>
              <li><code>\\s+</code> - Find multiple spaces</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-2">Use cases:</h4>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
              <li>Code refactoring and cleanup</li>
              <li>Data formatting and cleaning</li>
              <li>Content editing and proofreading</li>
              <li>Batch text modifications</li>
              <li>Template customization</li>
            </ul>
          </div>
        </div>
      </CollapsibleGuide>
    </div>
  );
}