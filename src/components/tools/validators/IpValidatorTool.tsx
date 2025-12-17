'use client';

import { useState } from 'react';
import ToolLayout from '@/components/common/ToolLayout';
import InputBox from '@/components/common/InputBox';
import OutputBox from '@/components/common/OutputBox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import CollapsibleGuide from '@/components/common/CollapsibleGuide';

export default function IpValidatorTool() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [ipInfo, setIpInfo] = useState<any>(null);

  const validateIpAddress = (ip: string) => {
    if (!ip.trim()) {
      setOutput('');
      setIsValid(null);
      setIpInfo(null);
      return;
    }

    const trimmedIp = ip.trim();
    
    // Check IPv4
    const ipv4Regex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
    
    // Check IPv6
    const ipv6Regex = /^(?:[0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$|^::1$|^::$/;
    const ipv6CompressedRegex = /^(?:[0-9a-fA-F]{1,4}:)*::(?:[0-9a-fA-F]{1,4}:)*[0-9a-fA-F]{1,4}$|^(?:[0-9a-fA-F]{1,4}:)*::[0-9a-fA-F]{1,4}$|^[0-9a-fA-F]{1,4}::(?:[0-9a-fA-F]{1,4}:)*[0-9a-fA-F]{1,4}$/;

    let version = '';
    let valid = false;
    let info: any = {};

    if (ipv4Regex.test(trimmedIp)) {
      version = 'IPv4';
      valid = true;
      info = analyzeIPv4(trimmedIp);
    } else if (ipv6Regex.test(trimmedIp) || ipv6CompressedRegex.test(trimmedIp)) {
      version = 'IPv6';
      valid = true;
      info = analyzeIPv6(trimmedIp);
    } else {
      valid = false;
    }

    setIsValid(valid);
    setIpInfo({ version, ...info });
    
    if (valid) {
      setOutput(`✓ Valid ${version} address`);
    } else {
      setOutput('✗ Invalid IP address format');
    }
  };

  const analyzeIPv4 = (ip: string) => {
    const octets = ip.split('.').map(Number);
    
    let type = 'Public';
    if (octets[0] === 10) type = 'Private (Class A)';
    else if (octets[0] === 172 && octets[1] >= 16 && octets[1] <= 31) type = 'Private (Class B)';
    else if (octets[0] === 192 && octets[1] === 168) type = 'Private (Class C)';
    else if (octets[0] === 127) type = 'Loopback';
    else if (octets[0] >= 224 && octets[0] <= 239) type = 'Multicast';
    else if (octets[0] === 169 && octets[1] === 254) type = 'Link-local';

    let class_ = '';
    if (octets[0] >= 1 && octets[0] <= 126) class_ = 'A';
    else if (octets[0] >= 128 && octets[0] <= 191) class_ = 'B';
    else if (octets[0] >= 192 && octets[0] <= 223) class_ = 'C';
    else if (octets[0] >= 224 && octets[0] <= 239) class_ = 'D (Multicast)';
    else if (octets[0] >= 240 && octets[0] <= 255) class_ = 'E (Reserved)';

    return {
      octets: octets.join('.'),
      type,
      class: class_,
      binary: octets.map(octet => octet.toString(2).padStart(8, '0')).join('.')
    };
  };

  const analyzeIPv6 = (ip: string) => {
    let type = 'Global Unicast';
    
    if (ip === '::1') type = 'Loopback';
    else if (ip === '::') type = 'Unspecified';
    else if (ip.startsWith('fe80:')) type = 'Link-local';
    else if (ip.startsWith('fc') || ip.startsWith('fd')) type = 'Unique Local';
    else if (ip.startsWith('ff')) type = 'Multicast';

    return {
      type,
      compressed: ip.includes('::'),
      fullForm: expandIPv6(ip)
    };
  };

  const expandIPv6 = (ip: string): string => {
    if (!ip.includes('::')) return ip;
    
    const parts = ip.split('::');
    const left = parts[0] ? parts[0].split(':') : [];
    const right = parts[1] ? parts[1].split(':') : [];
    
    const totalParts = 8;
    const missingParts = totalParts - left.length - right.length;
    const middle = Array(missingParts).fill('0000');
    
    const fullParts = [...left, ...middle, ...right];
    return fullParts.map(part => part.padStart(4, '0')).join(':');
  };

  const handleInputChange = (value: string) => {
    setInput(value);
    validateIpAddress(value);
  };

  const handleExample = () => {
    const examples = ['192.168.1.1', '10.0.0.1', '2001:db8::1', '::1'];
    const example = examples[Math.floor(Math.random() * examples.length)];
    setInput(example);
    validateIpAddress(example);
  };

  return (
    <div className="space-y-6">
      <ToolLayout>
        <InputBox
          title="IP Address"
          value={input}
          onChange={handleInputChange}
          placeholder="Enter IPv4 or IPv6 address..."
          type="input"
          example="Load random example"
          onExample={handleExample}
        />
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Validation Result</h3>
            {isValid !== null && (
              <Badge variant={isValid ? 'secondary' : 'destructive'}>
                {isValid ? 'Valid' : 'Invalid'}
              </Badge>
            )}
          </div>
          
          <OutputBox
            title="Result"
            value={output}
            placeholder="Validation result will appear here..."
          />

          {ipInfo && isValid && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">IP Address Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Version:</span>
                  <span className="font-mono">{ipInfo.version}</span>
                </div>
                <div className="flex justify-between">
                  <span>Type:</span>
                  <span className="font-mono">{ipInfo.type}</span>
                </div>
                
                {ipInfo.version === 'IPv4' && (
                  <>
                    <div className="flex justify-between">
                      <span>Class:</span>
                      <span className="font-mono">{ipInfo.class}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Binary:</span>
                      <span className="font-mono text-xs">{ipInfo.binary}</span>
                    </div>
                  </>
                )}
                
                {ipInfo.version === 'IPv6' && (
                  <>
                    <div className="flex justify-between">
                      <span>Compressed:</span>
                      <span className="font-mono">{ipInfo.compressed ? 'Yes' : 'No'}</span>
                    </div>
                    {ipInfo.fullForm && (
                      <div className="flex justify-between">
                        <span>Full form:</span>
                        <span className="font-mono text-xs">{ipInfo.fullForm}</span>
                      </div>
                    )}
                  </>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </ToolLayout>

      {/* Documentation */}
      <CollapsibleGuide title="IP Address Validator Guide">
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold mb-2">Supported formats:</h4>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
              <li><strong>IPv4:</strong> 192.168.1.1, 10.0.0.1, 127.0.0.1</li>
              <li><strong>IPv6:</strong> 2001:db8::1, ::1, fe80::1</li>
              <li><strong>IPv6 compressed:</strong> ::1, 2001:db8::</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-2">IPv4 address types:</h4>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
              <li><strong>Private:</strong> 10.x.x.x, 172.16-31.x.x, 192.168.x.x</li>
              <li><strong>Loopback:</strong> 127.x.x.x</li>
              <li><strong>Link-local:</strong> 169.254.x.x</li>
              <li><strong>Multicast:</strong> 224-239.x.x.x</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-2">IPv6 address types:</h4>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
              <li><strong>Loopback:</strong> ::1</li>
              <li><strong>Link-local:</strong> fe80::/10</li>
              <li><strong>Unique Local:</strong> fc00::/7</li>
              <li><strong>Multicast:</strong> ff00::/8</li>
            </ul>
          </div>
        </div>
      </CollapsibleGuide>
    </div>
  );
}