'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import CopyButton from '@/components/common/CopyButton';
import CollapsibleGuide from '@/components/common/CollapsibleGuide';

export default function DeviceInfoTool() {
  const [deviceInfo, setDeviceInfo] = useState<any>(null);

  useEffect(() => {
    const getDeviceInfo = () => {
      const info = {
        // Browser Info
        userAgent: navigator.userAgent,
        browser: getBrowserInfo(),
        
        // Screen Info
        screenWidth: screen.width,
        screenHeight: screen.height,
        screenColorDepth: screen.colorDepth,
        screenPixelDepth: screen.pixelDepth,
        
        // Viewport Info
        viewportWidth: window.innerWidth,
        viewportHeight: window.innerHeight,
        
        // Device Info
        platform: navigator.platform,
        language: navigator.language,
        languages: navigator.languages,
        cookieEnabled: navigator.cookieEnabled,
        onLine: navigator.onLine,
        
        // Time Zone
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        
        // Device Memory (if available)
        deviceMemory: (navigator as any).deviceMemory || 'Unknown',
        
        // Hardware Concurrency
        hardwareConcurrency: navigator.hardwareConcurrency,
        
        // Touch Support
        touchSupport: 'ontouchstart' in window || navigator.maxTouchPoints > 0,
        
        // Device Pixel Ratio
        devicePixelRatio: window.devicePixelRatio
      };
      
      setDeviceInfo(info);
    };

    const getBrowserInfo = () => {
      const ua = navigator.userAgent;
      let browser = 'Unknown';
      let version = 'Unknown';

      if (ua.includes('Chrome')) {
        browser = 'Chrome';
        version = ua.match(/Chrome\/(\d+)/)?.[1] || 'Unknown';
      } else if (ua.includes('Firefox')) {
        browser = 'Firefox';
        version = ua.match(/Firefox\/(\d+)/)?.[1] || 'Unknown';
      } else if (ua.includes('Safari') && !ua.includes('Chrome')) {
        browser = 'Safari';
        version = ua.match(/Version\/(\d+)/)?.[1] || 'Unknown';
      } else if (ua.includes('Edge')) {
        browser = 'Edge';
        version = ua.match(/Edge\/(\d+)/)?.[1] || 'Unknown';
      }

      return `${browser} ${version}`;
    };

    getDeviceInfo();
  }, []);

  if (!deviceInfo) {
    return <div>Loading device information...</div>;
  }

  const copyAllInfo = () => {
    const infoText = Object.entries(deviceInfo)
      .map(([key, value]) => `${key}: ${Array.isArray(value) ? value.join(', ') : value}`)
      .join('\n');
    navigator.clipboard.writeText(infoText);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Device Information</CardTitle>
            <CopyButton text={JSON.stringify(deviceInfo, null, 2)} />
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <h4 className="font-semibold">Browser</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Browser:</span>
                  <span className="font-mono">{deviceInfo.browser}</span>
                </div>
                <div className="flex justify-between">
                  <span>Platform:</span>
                  <span className="font-mono">{deviceInfo.platform}</span>
                </div>
                <div className="flex justify-between">
                  <span>Language:</span>
                  <span className="font-mono">{deviceInfo.language}</span>
                </div>
                <div className="flex justify-between">
                  <span>Cookies:</span>
                  <Badge variant={deviceInfo.cookieEnabled ? 'secondary' : 'destructive'}>
                    {deviceInfo.cookieEnabled ? 'Enabled' : 'Disabled'}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span>Online:</span>
                  <Badge variant={deviceInfo.onLine ? 'secondary' : 'destructive'}>
                    {deviceInfo.onLine ? 'Yes' : 'No'}
                  </Badge>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-semibold">Display</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Screen:</span>
                  <span className="font-mono">{deviceInfo.screenWidth} × {deviceInfo.screenHeight}</span>
                </div>
                <div className="flex justify-between">
                  <span>Viewport:</span>
                  <span className="font-mono">{deviceInfo.viewportWidth} × {deviceInfo.viewportHeight}</span>
                </div>
                <div className="flex justify-between">
                  <span>Color Depth:</span>
                  <span className="font-mono">{deviceInfo.screenColorDepth} bit</span>
                </div>
                <div className="flex justify-between">
                  <span>Pixel Ratio:</span>
                  <span className="font-mono">{deviceInfo.devicePixelRatio}x</span>
                </div>
                <div className="flex justify-between">
                  <span>Touch:</span>
                  <Badge variant={deviceInfo.touchSupport ? 'secondary' : 'outline'}>
                    {deviceInfo.touchSupport ? 'Supported' : 'Not Supported'}
                  </Badge>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-semibold">Hardware</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>CPU Cores:</span>
                  <span className="font-mono">{deviceInfo.hardwareConcurrency}</span>
                </div>
                <div className="flex justify-between">
                  <span>Memory:</span>
                  <span className="font-mono">{deviceInfo.deviceMemory} GB</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-semibold">Location</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Time Zone:</span>
                  <span className="font-mono">{deviceInfo.timeZone}</span>
                </div>
                <div className="flex justify-between">
                  <span>Languages:</span>
                  <span className="font-mono text-xs">{deviceInfo.languages.slice(0, 3).join(', ')}</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>User Agent</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-muted p-3 rounded text-sm font-mono break-all">
            {deviceInfo.userAgent}
          </div>
        </CardContent>
      </Card>

      <CollapsibleGuide title="Device Info Detector Guide">
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold mb-2">What it detects:</h4>
            <p className="text-sm text-muted-foreground">
              Displays comprehensive information about your device, browser, and system capabilities 
              using JavaScript APIs available in your browser.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-2">Information categories:</h4>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
              <li><strong>Browser:</strong> Name, version, platform, language settings</li>
              <li><strong>Display:</strong> Screen resolution, viewport size, color depth, pixel ratio</li>
              <li><strong>Hardware:</strong> CPU cores, device memory, touch support</li>
              <li><strong>Location:</strong> Time zone, preferred languages</li>
              <li><strong>Capabilities:</strong> Cookie support, online status</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-2">Use cases:</h4>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
              <li>Web development and testing</li>
              <li>Browser compatibility checking</li>
              <li>Device capability detection</li>
              <li>Responsive design testing</li>
              <li>Technical support and debugging</li>
              <li>Analytics and user research</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-2">Privacy note:</h4>
            <p className="text-sm text-muted-foreground">
              All information is detected locally using standard browser APIs. 
              No data is sent to external servers. The information shown is what 
              websites can typically access about your device.
            </p>
          </div>
        </div>
      </CollapsibleGuide>
    </div>
  );
}