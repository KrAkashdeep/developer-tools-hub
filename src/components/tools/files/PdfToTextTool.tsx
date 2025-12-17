'use client';

import { useState, useRef } from 'react';
import ToolLayout from '@/components/common/ToolLayout';
import OutputBox from '@/components/common/OutputBox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { IconUpload, IconX, IconDownload } from '@tabler/icons-react';
import CollapsibleGuide from '@/components/common/CollapsibleGuide';

interface PdfInfo {
  name: string;
  size: number;
  pages: number;
}

export default function PdfToTextTool() {
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [pdfInfo, setPdfInfo] = useState<PdfInfo | null>(null);
  const [extractedText, setExtractedText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      setError('Please select a valid PDF file');
      return;
    }

    setPdfFile(file);
    setPdfInfo({
      name: file.name,
      size: file.size,
      pages: 0 // Will be updated after processing
    });
    setError('');
    setExtractedText('');
  };

  const extractTextFromPdf = async () => {
    if (!pdfFile) return;

    setIsProcessing(true);
    setError('');

    try {
      // For a basic implementation, we'll use FileReader to read the PDF as text
      // Note: This is a simplified approach and won't work perfectly with all PDFs
      // In a real application, you'd want to use a library like PDF.js
      
      const reader = new FileReader();
      
      reader.onload = async (e) => {
        try {
          const arrayBuffer = e.target?.result as ArrayBuffer;
          const uint8Array = new Uint8Array(arrayBuffer);
          
          // Convert to string and try to extract readable text
          let text = '';
          let inTextObject = false;
          let currentText = '';
          
          // Simple PDF text extraction (very basic)
          const pdfString = String.fromCharCode.apply(null, Array.from(uint8Array));
          
          // Look for text objects in PDF
          const textMatches = pdfString.match(/\(([^)]+)\)/g);
          if (textMatches) {
            text = textMatches
              .map(match => match.slice(1, -1)) // Remove parentheses
              .filter(str => str.length > 1 && /[a-zA-Z]/.test(str)) // Filter meaningful text
              .join(' ');
          }
          
          // If no text found with simple method, try alternative approach
          if (!text.trim()) {
            // Look for stream objects
            const streamMatches = pdfString.match(/stream\s*([\s\S]*?)\s*endstream/g);
            if (streamMatches) {
              for (const stream of streamMatches) {
                const streamContent = stream.replace(/^stream\s*/, '').replace(/\s*endstream$/, '');
                // Try to extract readable characters
                const readableChars = streamContent.match(/[a-zA-Z0-9\s.,!?;:'"()-]+/g);
                if (readableChars) {
                  text += readableChars.join(' ') + ' ';
                }
              }
            }
          }
          
          // Clean up the extracted text
          text = text
            .replace(/\s+/g, ' ') // Replace multiple spaces with single space
            .replace(/[^\x20-\x7E\n]/g, '') // Remove non-printable characters
            .trim();
          
          if (text.length < 10) {
            setError('Could not extract readable text from this PDF. The PDF might be image-based or encrypted.');
            setExtractedText('');
          } else {
            setExtractedText(text);
            // Update page count (rough estimate)
            const estimatedPages = Math.max(1, Math.ceil(text.length / 3000));
            setPdfInfo(prev => prev ? { ...prev, pages: estimatedPages } : null);
          }
        } catch (err) {
          setError('Error processing PDF file. Please try a different file.');
          setExtractedText('');
        } finally {
          setIsProcessing(false);
        }
      };
      
      reader.onerror = () => {
        setError('Error reading PDF file');
        setIsProcessing(false);
      };
      
      reader.readAsArrayBuffer(pdfFile);
    } catch (err) {
      setError('Error processing PDF: ' + (err instanceof Error ? err.message : 'Unknown error'));
      setIsProcessing(false);
    }
  };

  const downloadText = () => {
    if (!extractedText || !pdfInfo) return;

    const blob = new Blob([extractedText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    const nameWithoutExt = pdfInfo.name.replace(/\.pdf$/i, '');
    link.download = `${nameWithoutExt}_extracted.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    URL.revokeObjectURL(url);
  };

  const removePdf = () => {
    setPdfFile(null);
    setPdfInfo(null);
    setExtractedText('');
    setError('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getTextStats = () => {
    if (!extractedText) return { words: 0, characters: 0, lines: 0 };
    
    const words = extractedText.trim().split(/\s+/).length;
    const characters = extractedText.length;
    const lines = extractedText.split('\n').length;
    
    return { words, characters, lines };
  };

  const stats = getTextStats();

  return (
    <div className="space-y-6">
      {/* Upload Section */}
      <Card>
        <CardHeader>
          <CardTitle>Upload PDF File</CardTitle>
          <CardDescription>Select a PDF file to extract text from</CardDescription>
        </CardHeader>
        <CardContent>
          {!pdfFile ? (
            <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,application/pdf"
                onChange={handleFileUpload}
                className="hidden"
              />
              <Button
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-2"
              >
                <IconUpload className="h-4 w-4" />
                Choose PDF File
              </Button>
              <p className="text-sm text-muted-foreground mt-2">
                Select a PDF file to extract text content
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-semibold">{pdfInfo?.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {formatFileSize(pdfInfo?.size || 0)}
                    {pdfInfo?.pages ? ` • ${pdfInfo.pages} pages` : ''}
                  </p>
                </div>
                <Button onClick={removePdf} size="sm" variant="destructive">
                  <IconX className="h-4 w-4" />
                </Button>
              </div>
              
              <Button 
                onClick={extractTextFromPdf} 
                className="w-full"
                disabled={isProcessing}
              >
                {isProcessing ? 'Extracting Text...' : 'Extract Text from PDF'}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Error Display */}
      {error && (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center text-destructive">
              <p className="font-semibold">Error</p>
              <p className="text-sm">{error}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Results */}
      {extractedText && (
        <>
          {/* Text Statistics */}
          <Card>
            <CardHeader>
              <CardTitle>Extraction Results</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4 text-center mb-4">
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
              
              <Button onClick={downloadText} className="w-full">
                <IconDownload className="h-4 w-4 mr-2" />
                Download as Text File
              </Button>
            </CardContent>
          </Card>

          {/* Extracted Text */}
          <ToolLayout>
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-semibold">Extracted Text</h3>
                <Badge variant="secondary">Success</Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                Text has been successfully extracted from the PDF. You can copy or download it.
              </p>
            </div>
            
            <OutputBox
              title="PDF Text Content"
              value={extractedText}
              placeholder="Extracted text will appear here..."
              rows={15}
            />
          </ToolLayout>
        </>
      )}

      {/* Documentation */}
      <CollapsibleGuide title="PDF to Text Extractor Guide">
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold mb-2">How it works:</h4>
            <p className="text-sm text-muted-foreground">
              This tool extracts text content from PDF files using basic PDF parsing. 
              It works best with text-based PDFs and may not work with image-based or heavily formatted PDFs.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-2">Features:</h4>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
              <li>Extract text from PDF files</li>
              <li>Word, character, and line counting</li>
              <li>Download extracted text as .txt file</li>
              <li>Copy text to clipboard</li>
              <li>Client-side processing (no upload to server)</li>
              <li>File size and page information</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-2">Best results with:</h4>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
              <li>Text-based PDF documents</li>
              <li>Simple formatted PDFs</li>
              <li>Documents created from text editors</li>
              <li>Non-encrypted PDF files</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-2">Limitations:</h4>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
              <li>May not work with image-based PDFs (scanned documents)</li>
              <li>Complex formatting may be lost</li>
              <li>Encrypted or password-protected PDFs not supported</li>
              <li>Tables and complex layouts may not extract properly</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-2">Use cases:</h4>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
              <li>Extract text for editing or analysis</li>
              <li>Convert PDF content to plain text</li>
              <li>Copy text from PDF documents</li>
              <li>Create searchable text from PDFs</li>
              <li>Archive PDF content as text files</li>
            </ul>
          </div>
        </div>
      </CollapsibleGuide>
    </div>
  );
}