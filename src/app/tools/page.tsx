import { Metadata } from 'next';
import { tools } from '@/lib/data/tools';
import AllToolsClient from './AllToolsClient';

export const metadata: Metadata = {
  title: 'All Developer Tools - multidevTools',
  description: `Browse all ${tools.length}+ developer tools including formatters, validators, encoders, converters, and more. Organized by category with advanced search and filtering.`,
  keywords: 'developer tools, formatters, validators, encoders, converters, utilities, web development, programming tools',
};

export default function ToolsPage() {
  return <AllToolsClient />;
}