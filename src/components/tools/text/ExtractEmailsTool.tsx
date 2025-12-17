'use client';

import { useState } from 'react';
import ToolLayout from '@/components/common/ToolLayout';
import InputBox from '@/components/common/InputBox';
import OutputBox from '@/components/common/OutputBox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import CollapsibleGuide from '@/components/common/CollapsibleGuide';

export default function ExtractEmailsTool() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [emailCount, setEmailCount] = useState(0);

  const extractEmails = (text: string) => {
    if (!text.trim()) {
      setOutput('');
      setEmailCount(0);
      return;
    }

    const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g;
    const emails = text.match(emailRegex) || [];
    const uniqueEmails = [...new Set(emails)];

    setOutput(uniqueEmails.join('\n'));
    setEmailCount(uniqueEmails.length);
  };

  const handleInputChange = (value: string) => {
    setInput(value);
    extractEmails(value);
  };

  const handleExample = () => {
    const example = `Contact us at support@example.com for help.
You can also reach out to sales@company.org or info@business.net.
For technical issues, email tech@support.com or admin@system.co.uk.
Invalid emails like notanemail or @invalid.com will be ignored.`;
    setInput(example);
    extractEmails(example);
  };

  return (
    <div className="space-y-6">
      <ToolLayout>
        <InputBox
          title="Text with Emails"
          value={input}
          onChange={handleInputChange}
          placeholder="Paste text containing email addresses..."
          example="Load example text"
          onExample={handleExample}
        />
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-semibold">Extracted Emails</h3>
            <Badge variant="outline">{emailCount} found</Badge>
          </div>
          <OutputBox
            title="Email Addresses"
            value={output}
            placeholder="Extracted email addresses will appear here..."
          />
        </div>
      </ToolLayout>

      <CollapsibleGuide title="Extract Emails Tool Guide">
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold mb-2">What it does:</h4>
            <p className="text-sm text-muted-foreground">
              Extracts all valid email addresses from text using regex pattern matching. 
              Automatically removes duplicates and provides a clean list.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-2">Features:</h4>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
              <li>Finds emails in any text format</li>
              <li>Removes duplicate email addresses</li>
              <li>Validates email format automatically</li>
              <li>Shows count of extracted emails</li>
              <li>One email per line output format</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-2">Use cases:</h4>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
              <li>Extract contacts from documents</li>
              <li>Parse email lists from web content</li>
              <li>Clean up mailing lists</li>
              <li>Data mining and lead generation</li>
              <li>Contact information extraction</li>
            </ul>
          </div>
        </div>
      </CollapsibleGuide>
    </div>
  );
}