'use client';

import { useState, useMemo } from 'react';
import ToolLayout from '@/components/common/ToolLayout';
import InputBox from '@/components/common/InputBox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import CollapsibleGuide from '@/components/common/CollapsibleGuide';

interface TextStats {
  characters: number;
  charactersNoSpaces: number;
  words: number;
  sentences: number;
  paragraphs: number;
  lines: number;
  readingTime: number;
}

export default function WordCounterTool() {
  const [input, setInput] = useState('');

  const stats = useMemo((): TextStats => {
    if (!input) {
      return {
        characters: 0,
        charactersNoSpaces: 0,
        words: 0,
        sentences: 0,
        paragraphs: 0,
        lines: 0,
        readingTime: 0
      };
    }

    const characters = input.length;
    const charactersNoSpaces = input.replace(/\s/g, '').length;
    
    // Count words (split by whitespace and filter empty strings)
    const words = input.trim() ? input.trim().split(/\s+/).length : 0;
    
    // Count sentences (split by sentence endings)
    const sentences = input.trim() ? input.split(/[.!?]+/).filter(s => s.trim().length > 0).length : 0;
    
    // Count paragraphs (split by double line breaks)
    const paragraphs = input.trim() ? input.split(/\n\s*\n/).filter(p => p.trim().length > 0).length : 0;
    
    // Count lines
    const lines = input ? input.split('\n').length : 0;
    
    // Calculate reading time (average 200 words per minute)
    const readingTime = Math.ceil(words / 200);

    return {
      characters,
      charactersNoSpaces,
      words,
      sentences,
      paragraphs,
      lines,
      readingTime
    };
  }, [input]);

  const handleExample = () => {
    const example = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.

Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.`;
    setInput(example);
  };

  return (
    <div className="space-y-6">
      <ToolLayout>
        <InputBox
          title="Text to Analyze"
          value={input}
          onChange={setInput}
          placeholder="Enter or paste your text here to analyze..."
          rows={15}
          example="Load sample text"
          onExample={handleExample}
        />
        
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Text Statistics</h3>
          
          <div className="grid grid-cols-2 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold text-primary">{stats.characters.toLocaleString()}</div>
                <p className="text-sm text-muted-foreground">Characters</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold text-primary">{stats.charactersNoSpaces.toLocaleString()}</div>
                <p className="text-sm text-muted-foreground">Characters (no spaces)</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold text-primary">{stats.words.toLocaleString()}</div>
                <p className="text-sm text-muted-foreground">Words</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold text-primary">{stats.sentences.toLocaleString()}</div>
                <p className="text-sm text-muted-foreground">Sentences</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold text-primary">{stats.paragraphs.toLocaleString()}</div>
                <p className="text-sm text-muted-foreground">Paragraphs</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold text-primary">{stats.lines.toLocaleString()}</div>
                <p className="text-sm text-muted-foreground">Lines</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div>
                  <div className="text-xl font-bold text-primary">{stats.readingTime} min</div>
                  <p className="text-sm text-muted-foreground">Estimated reading time</p>
                </div>
                <Badge variant="outline">~200 words/min</Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </ToolLayout>

      {/* Documentation */}
      <CollapsibleGuide title="Word Counter Tool Guide">
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold mb-2">What it does:</h4>
            <p className="text-sm text-muted-foreground">
              Analyzes text and provides detailed statistics including word count, character count, 
              sentences, paragraphs, and estimated reading time.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-2">Features:</h4>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
              <li>Real-time text analysis as you type</li>
              <li>Character count with and without spaces</li>
              <li>Word, sentence, and paragraph counting</li>
              <li>Line count for code and structured text</li>
              <li>Reading time estimation (200 words/minute)</li>
              <li>Handles multiple languages and special characters</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-2">Use cases:</h4>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
              <li>Writing articles and blog posts</li>
              <li>Academic papers and essays</li>
              <li>Social media content optimization</li>
              <li>SEO content analysis</li>
              <li>Meeting character limits for platforms</li>
              <li>Estimating content reading time</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-2">Tips:</h4>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
              <li>Use for Twitter's 280 character limit</li>
              <li>Check meta descriptions (150-160 characters)</li>
              <li>Optimize blog post length for SEO</li>
              <li>Estimate presentation speaking time</li>
            </ul>
          </div>
        </div>
      </CollapsibleGuide>
    </div>
  );
}