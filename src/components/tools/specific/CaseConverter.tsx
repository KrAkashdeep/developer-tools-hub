import React, { useState } from 'react';
import { ToolPageLayout } from '../ToolPageLayout';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toTitleCase, toCamelCase } from '@/lib/utils/text';
import { Tool } from '@/lib/types';

interface CaseConverterProps {
  tool: Tool;
}

type CaseType = 'title' | 'upper' | 'lower' | 'camel' | 'snake' | 'kebab' | 'pascal';

export function CaseConverter({ tool }: CaseConverterProps) {
  const [caseType, setCaseType] = useState<CaseType>('title');

  const handleProcess = (input: string) => {
    if (!input.trim()) {
      return { output: '' };
    }

    try {
      switch (caseType) {
        case 'title': {
          const result = toTitleCase(input);
          return {
            output: result.success ? result.result || '' : '',
            error: result.error
          };
        }
        
        case 'upper':
          return { output: input.toUpperCase() };
        
        case 'lower':
          return { output: input.toLowerCase() };
        
        case 'camel': {
          const result = toCamelCase(input);
          return {
            output: result.success ? result.result || '' : '',
            error: result.error
          };
        }
        
        case 'snake': {
          const snakeCase = input
            .toLowerCase()
            .replace(/[^\w\s]/g, '')
            .replace(/\s+/g, '_');
          return { output: snakeCase };
        }
        
        case 'kebab': {
          const kebabCase = input
            .toLowerCase()
            .replace(/[^\w\s]/g, '')
            .replace(/\s+/g, '-');
          return { output: kebabCase };
        }
        
        case 'pascal': {
          const pascalCase = input
            .toLowerCase()
            .replace(/[^\w\s]/g, '')
            .split(/\s+/)
            .map(word => {
              if (word.length === 0) return word;
              return word.charAt(0).toUpperCase() + word.slice(1);
            })
            .join('');
          return { output: pascalCase };
        }
        
        default:
          return { output: input };
      }
    } catch (error) {
      return {
        output: '',
        error: error instanceof Error ? error.message : 'Conversion failed'
      };
    }
  };

  const getPlaceholder = () => {
    switch (caseType) {
      case 'title':
        return 'Enter text to convert to Title Case...';
      case 'upper':
        return 'Enter text to convert to UPPERCASE...';
      case 'lower':
        return 'Enter text to convert to lowercase...';
      case 'camel':
        return 'Enter text to convert to camelCase...';
      case 'snake':
        return 'Enter text to convert to snake_case...';
      case 'kebab':
        return 'Enter text to convert to kebab-case...';
      case 'pascal':
        return 'Enter text to convert to PascalCase...';
      default:
        return 'Enter text to convert...';
    }
  };

  const getOutputPlaceholder = () => {
    switch (caseType) {
      case 'title':
        return 'Title Case text will appear here...';
      case 'upper':
        return 'UPPERCASE TEXT WILL APPEAR HERE...';
      case 'lower':
        return 'lowercase text will appear here...';
      case 'camel':
        return 'camelCaseText will appear here...';
      case 'snake':
        return 'snake_case_text will appear here...';
      case 'kebab':
        return 'kebab-case-text will appear here...';
      case 'pascal':
        return 'PascalCaseText will appear here...';
      default:
        return 'Converted text will appear here...';
    }
  };

  const options = (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="case-type">Case Type</Label>
        <Select value={caseType} onValueChange={(value: CaseType) => setCaseType(value)}>
          <SelectTrigger id="case-type" className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="title">Title Case</SelectItem>
            <SelectItem value="upper">UPPERCASE</SelectItem>
            <SelectItem value="lower">lowercase</SelectItem>
            <SelectItem value="camel">camelCase</SelectItem>
            <SelectItem value="snake">snake_case</SelectItem>
            <SelectItem value="kebab">kebab-case</SelectItem>
            <SelectItem value="pascal">PascalCase</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );

  return (
    <ToolPageLayout
      tool={tool}
      onProcess={handleProcess}
      options={options}
      placeholder={getPlaceholder()}
      outputPlaceholder={getOutputPlaceholder()}
    />
  );
}