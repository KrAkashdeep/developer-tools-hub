import { Metadata } from 'next';
import DocsClient from './DocsClient';

export const metadata: Metadata = {
  title: 'Documentation - multidevTools',
  description: 'Complete documentation for multidevTools - learn how to use our developer tools effectively, integrate with APIs, and maximize your productivity.',
  keywords: 'documentation, developer tools, API, integration, guides, tutorials',
};

export default function DocsPage() {
  return <DocsClient />;
}