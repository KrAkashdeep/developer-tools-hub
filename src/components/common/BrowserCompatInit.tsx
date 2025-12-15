'use client';

import { useEffect } from 'react';

export default function BrowserCompatInit() {
  useEffect(() => {
    // Check for required browser features
    const checkBrowserCompat = () => {
      const features = {
        localStorage: typeof Storage !== 'undefined',
        clipboard: navigator.clipboard !== undefined,
        fileReader: typeof FileReader !== 'undefined',
        canvas: typeof HTMLCanvasElement !== 'undefined',
        webWorkers: typeof Worker !== 'undefined',
      };

      // Store feature availability for tools to check
      if (typeof window !== 'undefined') {
        (window as any).browserFeatures = features;
      }

      // Log warnings for missing features
      Object.entries(features).forEach(([feature, available]) => {
        if (!available) {
          console.warn(`Browser feature not available: ${feature}`);
        }
      });
    };

    checkBrowserCompat();
  }, []);

  return null;
}