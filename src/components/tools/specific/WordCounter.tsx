import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import Breadcrumb from '@/components/common/Breadcrumb';
import { analyzeText } from '@/lib/utils/text';
import { Tool } from '@/lib/types';

interface WordCounterProps {
  tool: Tool;
}

export function WordCounter({ tool }: WordCounterProps) {
  const [input, setInput] = React.useState('');
  const analysis = analyzeText(input);

  const stats = [
    { label: 'Characters', value: analysis.characters, description: 'Total characters including spaces' },
    { label: 'Characters (no spaces)', value: analysis.charactersNoSpaces, description: 'Characters excluding spaces' },
    { label: 'Words', value: analysis.words, description: 'Total word count' },
    { label: 'Sentences', value: analysis.sentences, description: 'Number of sentences' },
    { label: 'Paragraphs', value: analysis.paragraphs, description: 'Number of paragraphs' },
    { label: 'Lines', value: analysis.lines, description: 'Number of non-empty lines' }
  ];

  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl">
      {/* Breadcrumb Navigation */}
      <Breadcrumb 
        items={[
          { label: 'Home', href: '/' },
          { label: 'Tools', href: '/tools' },
          { label: tool.name, href: `/tools/${tool.slug}` }
        ]}
      />

      {/* Tool Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{tool.name}</h1>
        <p className="text-lg text-muted-foreground">{tool.description}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Section */}
        <Card>
          <CardHeader>
            <CardTitle>Text Input</CardTitle>
            <CardDescription>Enter or paste your text to analyze</CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Enter your text here to see word count and other statistics..."
              className="min-h-[400px] font-mono text-sm"
              data-testid="text-input"
            />
          </CardContent>
        </Card>

        {/* Statistics Section */}
        <Card>
          <CardHeader>
            <CardTitle>Text Statistics</CardTitle>
            <CardDescription>Real-time analysis of your text</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.map((stat, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div>
                    <p className="font-medium">{stat.label}</p>
                    <p className="text-sm text-muted-foreground">{stat.description}</p>
                  </div>
                  <div className="text-2xl font-bold text-primary" data-testid={`stat-${stat.label.toLowerCase().replace(/[^a-z]/g, '-')}`}>
                    {stat.value.toLocaleString()}
                  </div>
                </div>
              ))}
            </div>

            {/* Reading Time Estimate */}
            {analysis.words > 0 && (
              <div className="mt-6 p-4 bg-primary/10 rounded-lg">
                <h4 className="font-medium mb-2">Reading Time Estimate</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Average (200 WPM)</p>
                    <p className="font-medium" data-testid="reading-time-average">
                      {Math.ceil(analysis.words / 200)} min
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Fast (300 WPM)</p>
                    <p className="font-medium" data-testid="reading-time-fast">
                      {Math.ceil(analysis.words / 300)} min
                    </p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}