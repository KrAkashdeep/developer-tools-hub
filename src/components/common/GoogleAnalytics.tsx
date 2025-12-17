'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { initGA, trackPageView, GA_TRACKING_ID } from '@/lib/utils/analytics';

export default function GoogleAnalytics() {
  const pathname = usePathname();

  useEffect(() => {
    // Initialize GA4 on component mount
    if (GA_TRACKING_ID) {
      initGA();
    }
  }, []);

  useEffect(() => {
    // Track page views on route changes
    if (GA_TRACKING_ID && pathname) {
      trackPageView(pathname);
    }
  }, [pathname]);

  // Don't render anything in development or if no tracking ID
  if (!GA_TRACKING_ID || process.env.NODE_ENV === 'development') {
    return null;
  }

  return null;
}