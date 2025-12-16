'use client';

import Link from 'next/link';
import { IconTool, IconHeart } from '@tabler/icons-react';

export default function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo & Description */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center space-x-2">
              <div className="h-7 w-7 rounded-full bg-white p-1 border border-gray-200 flex items-center justify-center overflow-hidden">
                <img 
                  src="/icon.svg" 
                  alt="multidevTools Logo" 
                  className="h-5 w-5 object-cover"
                />
              </div>
              <span className="text-lg font-bold">multidevTools</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              A comprehensive collection of 80+ developer tools for formatting, validation, encoding, conversion, and more.
            </p>
          </div>

          {/* Tools */}
          <div>
            <h3 className="font-semibold mb-4">Popular Tools</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/tools/json-formatter" className="text-muted-foreground hover:text-foreground transition-colors">
                  JSON Formatter
                </Link>
              </li>
              <li>
                <Link href="/tools/base64-encode" className="text-muted-foreground hover:text-foreground transition-colors">
                  Base64 Encoder
                </Link>
              </li>
              <li>
                <Link href="/tools/uuid-generator" className="text-muted-foreground hover:text-foreground transition-colors">
                  UUID Generator
                </Link>
              </li>
              <li>
                <Link href="/tools/color-picker" className="text-muted-foreground hover:text-foreground transition-colors">
                  Color Picker
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="font-semibold mb-4">Categories</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/category/formatters" className="text-muted-foreground hover:text-foreground transition-colors">
                  Formatters
                </Link>
              </li>
              <li>
                <Link href="/category/validators" className="text-muted-foreground hover:text-foreground transition-colors">
                  Validators
                </Link>
              </li>
              <li>
                <Link href="/category/converters" className="text-muted-foreground hover:text-foreground transition-colors">
                  Converters
                </Link>
              </li>
              <li>
                <Link href="/category/encoders" className="text-muted-foreground hover:text-foreground transition-colors">
                  Encoders
                </Link>
              </li>
            </ul>
          </div>

          {/* Links */}
          <div>
            <h3 className="font-semibold mb-4">Resources</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/tools" className="text-muted-foreground hover:text-foreground transition-colors">
                  All Tools
                </Link>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                  API Documentation
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-muted-foreground">
            © 2025 multidevTools. All rights reserved.
          </p>
          <p className="text-sm text-muted-foreground flex items-center gap-1 mt-4 md:mt-0">
            Made with <IconHeart className="h-4 w-4 text-red-500" /> for developers
          </p>
        </div>
      </div>
    </footer>
  );
}