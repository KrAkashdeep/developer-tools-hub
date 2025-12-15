'use client';

import { useState } from 'react';
import ToolLayout from '@/components/common/ToolLayout';
import InputBox from '@/components/common/InputBox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { IconDownload } from '@tabler/icons-react';

export default function TextToPdfTool() {
  const [input, setInput] = useState('');
  const [filename, setFilename] = useState('document.pdf');
  const [fontSize, setFontSize] = useState('12');
  const [lineHeight, setLineHeight] = useState('1.5');
  const [margin, setMargin] = useState('20');
  const [isGenerating, setIsGenerating] = useState(false);

  const generatePDF = async () => {
    if (!input.trim()) {
      alert('Please enter some text to convert');
      return;
    }

    setIsGenerating(true);

    try {
      // Create a simple PDF using canvas and manual PDF generation
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // PDF dimensions (A4: 595 x 842 points)
      const pageWidth = 595;
      const pageHeight = 842;
      const marginPx = parseInt(margin);
      const contentWidth = pageWidth - (marginPx * 2);
      const contentHeight = pageHeight - (marginPx * 2);
      
      canvas.width = pageWidth;
      canvas.height = pageHeight;

      // Set font
      const fontSizePx = parseInt(fontSize);
      const lineHeightPx = fontSizePx * parseFloat(lineHeight);
      ctx.font = `${fontSizePx}px Arial, sans-serif`;
      ctx.fillStyle = '#000000';

      // Split text into lines that fit the page width
      const words = input.split(' ');
      const lines: string[] = [];
      let currentLine = '';

      for (const word of words) {
        const testLine = currentLine + (currentLine ? ' ' : '') + word;
        const metrics = ctx.measureText(testLine);
        
        if (metrics.width > contentWidth && currentLine) {
          lines.push(currentLine);
          currentLine = word;
        } else {
          currentLine = testLine;
        }
      }
      if (currentLine) {
        lines.push(currentLine);
      }

      // Handle line breaks in original text
      const finalLines: string[] = [];
      for (const line of lines) {
        const splitLines = line.split('\n');
        finalLines.push(...splitLines);
      }

      // Create PDF content
      let pdfContent = `%PDF-1.4
1 0 obj
<<
/Type /Catalog
/Pages 2 0 R
>>
endobj

2 0 obj
<<
/Type /Pages
/Kids [3 0 R]
/Count 1
>>
endobj

3 0 obj
<<
/Type /Page
/Parent 2 0 R
/MediaBox [0 0 ${pageWidth} ${pageHeight}]
/Contents 4 0 R
/Resources <<
  /Font <<
    /F1 5 0 R
  >>
>>
>>
endobj

4 0 obj
<<
/Length ${finalLines.length * 50 + 100}
>>
stream
BT
/F1 ${fontSizePx} Tf
${marginPx} ${pageHeight - marginPx - fontSizePx} Td
${lineHeightPx} TL
`;

      // Add text lines
      finalLines.forEach((line, index) => {
        if (index > 0) {
          pdfContent += 'T*\n';
        }
        // Escape special characters
        const escapedLine = line.replace(/\\/g, '\\\\').replace(/\(/g, '\\(').replace(/\)/g, '\\)');
        pdfContent += `(${escapedLine}) Tj\n`;
      });

      pdfContent += `ET
endstream
endobj

5 0 obj
<<
/Type /Font
/Subtype /Type1
/BaseFont /Helvetica
>>
endobj

xref
0 6
0000000000 65535 f 
0000000010 00000 n 
0000000079 00000 n 
0000000173 00000 n 
0000000301 00000 n 
0000000380 00000 n 
trailer
<<
/Size 6
/Root 1 0 R
>>
startxref
456
%%EOF`;

      // Create blob and download
      const blob = new Blob([pdfContent], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = filename.endsWith('.pdf') ? filename : `${filename}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      URL.revokeObjectURL(url);
    } catch (error) {
      alert('Error generating PDF: ' + (error instanceof Error ? error.message : 'Unknown error'));
    } finally {
      setIsGenerating(false);
    }
  };

  const handleExample = () => {
    const example = `Sample Document

This is a sample text document that will be converted to PDF format.

Features:
• Simple text formatting
• Line breaks and paragraphs
• Multiple lines of content

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.

Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

Thank you for using the Text to PDF converter!`;
    setInput(example);
  };

  const getTextStats = () => {
    if (!input) return { words: 0, characters: 0, lines: 0 };
    
    const words = input.trim().split(/\s+/).length;
    const characters = input.length;
    const lines = input.split('\n').length;
    
    return { words, characters, lines };
  };

  const stats = getTextStats();

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>PDF Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="filename">Filename</Label>
              <Input
                id="filename"
                value={filename}
                onChange={(e) => setFilename(e.target.value)}
                placeholder="document.pdf"
                className="mt-2"
              />
            </div>
            
            <div>
              <Label htmlFor="fontSize">Font Size (px)</Label>
              <Input
                id="fontSize"
                type="number"
                value={fontSize}
                onChange={(e) => setFontSize(e.target.value)}
                min="8"
                max="72"
                className="mt-2"
              />
            </div>
            
            <div>
              <Label htmlFor="lineHeight">Line Height</Label>
              <Input
                id="lineHeight"
                type="number"
                step="0.1"
                value={lineHeight}
                onChange={(e) => setLineHeight(e.target.value)}
                min="1"
                max="3"
                className="mt-2"
              />
            </div>
            
            <div>
              <Label htmlFor="margin">Margin (px)</Label>
              <Input
                id="margin"
                type="number"
                value={margin}
                onChange={(e) => setMargin(e.target.value)}
                min="10"
                max="100"
                className="mt-2"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <ToolLayout>
        <InputBox
          title="Text Content"
          value={input}
          onChange={setInput}
          placeholder="Enter the text you want to convert to PDF..."
          rows={15}
          example="Load example text"
          onExample={handleExample}
        />
        
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Document Preview</h3>
          
          {/* Text Statistics */}
          <Card>
            <CardContent className="pt-6">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-primary">{stats.words}</div>
                  <p className="text-sm text-muted-foreground">Words</p>
                </div>
                <div>
                  <div className="text-2xl font-bold text-primary">{stats.characters}</div>
                  <p className="text-sm text-muted-foreground">Characters</p>
                </div>
                <div>
                  <div className="text-2xl font-bold text-primary">{stats.lines}</div>
                  <p className="text-sm text-muted-foreground">Lines</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* PDF Preview */}
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-3">
                <div className="flex gap-2 flex-wrap">
                  <Badge variant="outline">A4 Size</Badge>
                  <Badge variant="outline">{fontSize}px Font</Badge>
                  <Badge variant="outline">{lineHeight}x Line Height</Badge>
                  <Badge variant="outline">{margin}px Margin</Badge>
                </div>
                
                <div 
                  className="border rounded p-4 bg-white text-black min-h-[200px] max-h-[400px] overflow-auto"
                  style={{
                    fontSize: `${Math.max(8, parseInt(fontSize) * 0.8)}px`,
                    lineHeight: lineHeight,
                    fontFamily: 'Arial, sans-serif'
                  }}
                >
                  {input || 'Your text will appear here...'}
                </div>
                
                <Button 
                  onClick={generatePDF} 
                  className="w-full"
                  disabled={!input.trim() || isGenerating}
                >
                  <IconDownload className="h-4 w-4 mr-2" />
                  {isGenerating ? 'Generating PDF...' : 'Download as PDF'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </ToolLayout>

      {/* Documentation */}
      <Card>
        <CardHeader>
          <CardTitle>Text to PDF Converter Guide</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-semibold mb-2">Features:</h4>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
              <li>Convert plain text to PDF format</li>
              <li>Customizable font size and line height</li>
              <li>Adjustable margins</li>
              <li>A4 page size (595 x 842 points)</li>
              <li>Automatic text wrapping</li>
              <li>Preserves line breaks and paragraphs</li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-2">Settings guide:</h4>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
              <li><strong>Font Size:</strong> 8-72px (12px recommended for body text)</li>
              <li><strong>Line Height:</strong> 1.0-3.0 (1.5 recommended for readability)</li>
              <li><strong>Margin:</strong> 10-100px (20px provides good balance)</li>
              <li><strong>Filename:</strong> Will automatically add .pdf extension</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-2">Use cases:</h4>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
              <li>Convert notes to PDF for sharing</li>
              <li>Create simple documents</li>
              <li>Generate printable text files</li>
              <li>Archive text content</li>
              <li>Create formatted documents from plain text</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-2">Limitations:</h4>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
              <li>Basic text formatting only (no bold, italic, etc.)</li>
              <li>Single page output</li>
              <li>Arial font family only</li>
              <li>No images or complex layouts</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}