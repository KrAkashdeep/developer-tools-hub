'use client';

import { useState } from 'react';
import ToolLayout from '@/components/common/ToolLayout';
import InputBox from '@/components/common/InputBox';
import OutputBox from '@/components/common/OutputBox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import CollapsibleGuide from '@/components/common/CollapsibleGuide';

export default function SqlBeautifierTool() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');

  const formatSql = (sql: string) => {
    if (!sql.trim()) {
      setOutput('');
      return;
    }

    try {
      // SQL keywords that should be on new lines
      const keywords = [
        'SELECT', 'FROM', 'WHERE', 'JOIN', 'INNER JOIN', 'LEFT JOIN', 'RIGHT JOIN', 'FULL JOIN',
        'GROUP BY', 'HAVING', 'ORDER BY', 'LIMIT', 'OFFSET', 'UNION', 'UNION ALL',
        'INSERT INTO', 'VALUES', 'UPDATE', 'SET', 'DELETE FROM', 'CREATE TABLE',
        'ALTER TABLE', 'DROP TABLE', 'CREATE INDEX', 'DROP INDEX'
      ];

      let formatted = sql
        // Normalize whitespace
        .replace(/\s+/g, ' ')
        .trim();

      // Add line breaks before major keywords
      keywords.forEach(keyword => {
        const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
        formatted = formatted.replace(regex, `\n${keyword}`);
      });

      // Add line breaks after commas in SELECT statements
      formatted = formatted.replace(/,(?=\s*\w)/g, ',\n  ');

      // Add proper indentation
      const lines = formatted.split('\n');
      const formattedLines = lines.map((line, index) => {
        const trimmedLine = line.trim();
        if (!trimmedLine) return '';

        // Main keywords start at beginning
        if (keywords.some(keyword => trimmedLine.toUpperCase().startsWith(keyword.toUpperCase()))) {
          return trimmedLine;
        }
        
        // Indent other lines
        return '  ' + trimmedLine;
      });

      // Clean up extra line breaks
      const result = formattedLines
        .join('\n')
        .replace(/\n\s*\n/g, '\n')
        .trim();

      setOutput(result);
    } catch (err) {
      setOutput('Error formatting SQL');
    }
  };

  const handleInputChange = (value: string) => {
    setInput(value);
    formatSql(value);
  };

  const handleExample = () => {
    const example = `SELECT u.id, u.name, u.email, p.title, p.content, c.name as category FROM users u INNER JOIN posts p ON u.id = p.user_id LEFT JOIN categories c ON p.category_id = c.id WHERE u.active = 1 AND p.published = 1 AND p.created_at >= '2025-01-01' ORDER BY p.created_at DESC, u.name ASC LIMIT 10;`;
    setInput(example);
    formatSql(example);
  };

  return (
    <div className="space-y-6">
      <ToolLayout>
        <InputBox
          title="SQL Input"
          value={input}
          onChange={handleInputChange}
          placeholder="Paste your SQL query here..."
          example="Load example SQL"
          onExample={handleExample}
        />
        
        <OutputBox
          title="Formatted SQL"
          value={output}
          placeholder="Formatted SQL will appear here..."
        />
      </ToolLayout>

      {/* Documentation */}
      <CollapsibleGuide title="SQL Beautifier Guide">
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold mb-2">What it does:</h4>
            <p className="text-sm text-muted-foreground">
              Formats and beautifies SQL queries with proper indentation, line breaks, 
              and keyword capitalization to improve readability and maintainability.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-2">Features:</h4>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
              <li>Real-time SQL formatting</li>
              <li>Proper keyword placement and indentation</li>
              <li>Handles SELECT, INSERT, UPDATE, DELETE statements</li>
              <li>Supports JOINs, subqueries, and complex queries</li>
              <li>One-click copy functionality</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-2">Supported SQL features:</h4>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
              <li>SELECT statements with multiple columns</li>
              <li>JOIN operations (INNER, LEFT, RIGHT, FULL)</li>
              <li>WHERE clauses and conditions</li>
              <li>GROUP BY, HAVING, ORDER BY clauses</li>
              <li>INSERT, UPDATE, DELETE statements</li>
              <li>CREATE and ALTER TABLE statements</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-2">Use cases:</h4>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
              <li>Format minified or compressed SQL queries</li>
              <li>Clean up generated SQL from ORMs</li>
              <li>Prepare SQL for code reviews</li>
              <li>Debug and understand complex queries</li>
              <li>Improve SQL code readability</li>
            </ul>
          </div>
        </div>
      </CollapsibleGuide>
    </div>
  );
}