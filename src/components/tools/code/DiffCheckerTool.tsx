'use client';

import { useState } from 'react';
import ToolLayout from '@/components/common/ToolLayout';
import InputBox from '@/components/common/InputBox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import CollapsibleGuide from '@/components/common/CollapsibleGuide';

export default function DiffCheckerTool() {
  const [text1, setText1] = useState('');
  const [text2, setText2] = useState('');
  const [diff, setDiff] = useState('');

  const calculateDiff = (original: string, modified: string) => {
    if (!original && !modified) {
      setDiff('');
      return;
    }

    const lines1 = original.split('\n');
    const lines2 = modified.split('\n');
    const maxLines = Math.max(lines1.length, lines2.length);
    
    let diffResult = '';
    
    for (let i = 0; i < maxLines; i++) {
      const line1 = lines1[i] || '';
      const line2 = lines2[i] || '';
      
      if (line1 === line2) {
        diffResult += `  ${line1}\n`;
      } else if (!line1) {
        diffResult += `+ ${line2}\n`;
      } else if (!line2) {
        diffResult += `- ${line1}\n`;
      } else {
        diffResult += `- ${line1}\n`;
        diffResult += `+ ${line2}\n`;
      }
    }

    setDiff(diffResult);
  };

  const handleText1Change = (value: string) => {
    setText1(value);
    calculateDiff(value, text2);
  };

  const handleText2Change = (value: string) => {
    setText2(value);
    calculateDiff(text1, value);
  };

  const handleExample = () => {
    const example1 = `Hello World
This is line 2
This is line 3
Old line`;
    const example2 = `Hello World
This is line 2 modified
This is line 3
New line`;
    setText1(example1);
    setText2(example2);
    calculateDiff(example1, example2);
  };

  return (
    <div className="space-y-6">
      <ToolLayout>
        <InputBox
          title="Original Text"
          value={text1}
          onChange={handleText1Change}
          placeholder="Enter original text..."
          example="Load example"
          onExample={handleExample}
        />
        <InputBox
          title="Modified Text"
          value={text2}
          onChange={handleText2Change}
          placeholder="Enter modified text..."
        />
      </ToolLayout>

      <Card>
        <CardHeader>
          <CardTitle>Differences</CardTitle>
        </CardHeader>
        <CardContent>
          <pre className="bg-muted p-4 rounded text-sm overflow-x-auto whitespace-pre-wrap min-h-[200px]">
            {diff || 'Differences will appear here...'}
          </pre>
          <div className="mt-4 text-sm text-muted-foreground">
            <div className="flex gap-4">
              <span><span className="text-red-500">-</span> Removed lines</span>
              <span><span className="text-green-500">+</span> Added lines</span>
              <span>  Unchanged lines</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <CollapsibleGuide title="Diff Checker Guide">
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold mb-2">How it works:</h4>
            <p className="text-sm text-muted-foreground">
              Compare two texts line by line and highlight the differences between them. 
              Shows added, removed, and unchanged lines in a unified diff format.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-2">Legend:</h4>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
              <li><span className="text-red-500">- Red lines:</span> Removed from original text</li>
              <li><span className="text-green-500">+ Green lines:</span> Added in modified text</li>
              <li>  Unchanged lines: Present in both texts</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-2">Use cases:</h4>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
              <li>Compare different versions of code or documents</li>
              <li>Review changes before committing</li>
              <li>Identify what changed between file versions</li>
              <li>Merge conflicts resolution</li>
              <li>Content editing and proofreading</li>
            </ul>
          </div>
        </div>
      </CollapsibleGuide>
    </div>
  );
}