import { Metadata } from 'next';
import AboutClient from './AboutClient';

export const metadata: Metadata = {
  title: 'About - multiDevtools',
  description: 'Learn about multiDevtools and get in touch with us. Send feedback, suggestions, or questions about our developer tools.',
  keywords: 'about, contact, feedback, developer tools, multidevtools',
};

export default function AboutPage() {
  return <AboutClient />;
}