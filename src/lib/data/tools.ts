export interface Tool {
  id: string;
  name: string;
  description: string;
  category: string;
  slug: string;
  icon: string;
  popular?: boolean;
  tags?: string[];
}

export interface Category {
  id: string;
  name: string;
  description: string;
  slug: string;
  icon: string;
  color: string;
}

export const categories: Category[] = [
  {
    id: 'formatters',
    name: 'Formatters',
    description: 'Format and beautify your code',
    slug: 'formatters',
    icon: 'IconCode',
    color: 'bg-blue-500'
  },
  {
    id: 'validators',
    name: 'Validators',
    description: 'Validate data formats and structures',
    slug: 'validators',
    icon: 'IconShieldCheck',
    color: 'bg-green-500'
  },
  {
    id: 'encoders',
    name: 'Encoders/Decoders',
    description: 'Encode and decode various formats',
    slug: 'encoders',
    icon: 'IconLock',
    color: 'bg-purple-500'
  },
  {
    id: 'converters',
    name: 'Converters',
    description: 'Convert between different formats',
    slug: 'converters',
    icon: 'IconRefresh',
    color: 'bg-orange-500'
  },
  {
    id: 'colors',
    name: 'Color Tools',
    description: 'Work with colors and palettes',
    slug: 'colors',
    icon: 'IconPalette',
    color: 'bg-pink-500'
  },
  {
    id: 'text',
    name: 'Text Utilities',
    description: 'Manipulate and analyze text',
    slug: 'text',
    icon: 'IconFileText',
    color: 'bg-indigo-500'
  },
  {
    id: 'files',
    name: 'File Tools',
    description: 'Process and manipulate files',
    slug: 'files',
    icon: 'IconFile',
    color: 'bg-yellow-500'
  },
  {
    id: 'code',
    name: 'Code Tools',
    description: 'Developer code utilities',
    slug: 'code',
    icon: 'IconTerminal',
    color: 'bg-red-500'
  },
  {
    id: 'system',
    name: 'System Tools',
    description: 'System and utility tools',
    slug: 'system',
    icon: 'IconSettings',
    color: 'bg-gray-500'
  }
];

export const tools: Tool[] = [
  // Formatters (10 tools)
  {
    id: 'json-formatter',
    name: 'JSON Formatter',
    description: 'Format and beautify JSON data',
    category: 'formatters',
    slug: 'json-formatter',
    icon: 'IconBraces',
    popular: true
  },
  {
    id: 'json-minifier',
    name: 'JSON Minifier',
    description: 'Minify JSON data to reduce size',
    category: 'formatters',
    slug: 'json-minifier',
    icon: 'IconCompress'
  },
  {
    id: 'html-formatter',
    name: 'HTML Formatter',
    description: 'Format and beautify HTML code',
    category: 'formatters',
    slug: 'html-formatter',
    icon: 'IconCode'
  },
  {
    id: 'html-minifier',
    name: 'HTML Minifier',
    description: 'Minify HTML code to reduce size',
    category: 'formatters',
    slug: 'html-minifier',
    icon: 'IconCompress'
  },
  {
    id: 'css-formatter',
    name: 'CSS Formatter',
    description: 'Format and beautify CSS code',
    category: 'formatters',
    slug: 'css-formatter',
    icon: 'IconBrush'
  },
  {
    id: 'css-minifier',
    name: 'CSS Minifier',
    description: 'Minify CSS code to reduce size',
    category: 'formatters',
    slug: 'css-minifier',
    icon: 'IconCompress'
  },
  {
    id: 'js-formatter',
    name: 'JavaScript Formatter',
    description: 'Format and beautify JavaScript code',
    category: 'formatters',
    slug: 'js-formatter',
    icon: 'IconBrandJavascript'
  },
  {
    id: 'js-minifier',
    name: 'JavaScript Minifier',
    description: 'Minify JavaScript code to reduce size',
    category: 'formatters',
    slug: 'js-minifier',
    icon: 'IconCompress'
  },
  {
    id: 'sql-beautifier',
    name: 'SQL Beautifier',
    description: 'Format and beautify SQL queries',
    category: 'formatters',
    slug: 'sql-beautifier',
    icon: 'IconDatabase'
  },
  {
    id: 'xml-formatter',
    name: 'XML Formatter',
    description: 'Format and beautify XML data',
    category: 'formatters',
    slug: 'xml-formatter',
    icon: 'IconCode'
  },

  // Validators (8 tools)
  {
    id: 'json-validator',
    name: 'JSON Validator',
    description: 'Validate JSON syntax and structure',
    category: 'validators',
    slug: 'json-validator',
    icon: 'IconShieldCheck',
    popular: true
  },
  {
    id: 'html-validator',
    name: 'HTML Validator',
    description: 'Validate HTML markup',
    category: 'validators',
    slug: 'html-validator',
    icon: 'IconShieldCheck'
  },
  {
    id: 'css-validator',
    name: 'CSS Validator',
    description: 'Validate CSS syntax',
    category: 'validators',
    slug: 'css-validator',
    icon: 'IconShieldCheck'
  },
  {
    id: 'url-validator',
    name: 'URL Validator',
    description: 'Validate URL format and structure',
    category: 'validators',
    slug: 'url-validator',
    icon: 'IconLink'
  },
  {
    id: 'email-validator',
    name: 'Email Validator',
    description: 'Validate email address format',
    category: 'validators',
    slug: 'email-validator',
    icon: 'IconMail'
  },
  {
    id: 'ip-validator',
    name: 'IP Address Validator',
    description: 'Validate IPv4 and IPv6 addresses',
    category: 'validators',
    slug: 'ip-validator',
    icon: 'IconNetwork'
  },
  {
    id: 'uuid-validator',
    name: 'UUID Validator',
    description: 'Validate UUID format',
    category: 'validators',
    slug: 'uuid-validator',
    icon: 'IconFingerprint'
  },
  {
    id: 'credit-card-validator',
    name: 'Credit Card Validator',
    description: 'Validate credit card numbers',
    category: 'validators',
    slug: 'credit-card-validator',
    icon: 'IconCreditCard'
  },

  // Encoders/Decoders (12 tools)
  {
    id: 'base64-encode',
    name: 'Base64 Encode',
    description: 'Encode text to Base64 format',
    category: 'encoders',
    slug: 'base64-encode',
    icon: 'IconLock',
    popular: true
  },
  {
    id: 'base64-decode',
    name: 'Base64 Decode',
    description: 'Decode Base64 encoded text',
    category: 'encoders',
    slug: 'base64-decode',
    icon: 'IconLockOpen'
  },
  {
    id: 'url-encode',
    name: 'URL Encode',
    description: 'Encode text for URL usage',
    category: 'encoders',
    slug: 'url-encode',
    icon: 'IconLink'
  },
  {
    id: 'url-decode',
    name: 'URL Decode',
    description: 'Decode URL encoded text',
    category: 'encoders',
    slug: 'url-decode',
    icon: 'IconUnlink'
  },
  {
    id: 'html-encode',
    name: 'HTML Encode',
    description: 'Encode HTML entities',
    category: 'encoders',
    slug: 'html-encode',
    icon: 'IconCode'
  },
  {
    id: 'html-decode',
    name: 'HTML Decode',
    description: 'Decode HTML entities',
    category: 'encoders',
    slug: 'html-decode',
    icon: 'IconCode'
  },
  {
    id: 'jwt-decoder',
    name: 'JWT Decoder',
    description: 'Decode JWT tokens',
    category: 'encoders',
    slug: 'jwt-decoder',
    icon: 'IconKey'
  },
  {
    id: 'morse-encode',
    name: 'Morse Code Encoder',
    description: 'Encode text to Morse code',
    category: 'encoders',
    slug: 'morse-encode',
    icon: 'IconDots'
  },
  {
    id: 'morse-decode',
    name: 'Morse Code Decoder',
    description: 'Decode Morse code to text',
    category: 'encoders',
    slug: 'morse-decode',
    icon: 'IconDots'
  },
  {
    id: 'gzip-compress',
    name: 'GZip Compressor',
    description: 'Compress text using GZip',
    category: 'encoders',
    slug: 'gzip-compress',
    icon: 'IconArchive'
  },
  {
    id: 'gzip-decompress',
    name: 'GZip Decompressor',
    description: 'Decompress GZip compressed text',
    category: 'encoders',
    slug: 'gzip-decompress',
    icon: 'IconArchiveOff'
  },
  {
    id: 'hash-generator',
    name: 'Hash Generator',
    description: 'Generate MD5, SHA1, SHA256 hashes',
    category: 'encoders',
    slug: 'hash-generator',
    icon: 'IconHash'
  },

  // Converters (16 tools)
  {
    id: 'json-to-csv',
    name: 'JSON to CSV',
    description: 'Convert JSON data to CSV format',
    category: 'converters',
    slug: 'json-to-csv',
    icon: 'IconFileSpreadsheet'
  },
  {
    id: 'csv-to-json',
    name: 'CSV to JSON',
    description: 'Convert CSV data to JSON format',
    category: 'converters',
    slug: 'csv-to-json',
    icon: 'IconBraces'
  },
  {
    id: 'json-to-xml',
    name: 'JSON to XML',
    description: 'Convert JSON data to XML format',
    category: 'converters',
    slug: 'json-to-xml',
    icon: 'IconCode'
  },
  {
    id: 'xml-to-json',
    name: 'XML to JSON',
    description: 'Convert XML data to JSON format',
    category: 'converters',
    slug: 'xml-to-json',
    icon: 'IconBraces'
  },
  {
    id: 'markdown-to-html',
    name: 'Markdown to HTML',
    description: 'Convert Markdown to HTML',
    category: 'converters',
    slug: 'markdown-to-html',
    icon: 'IconMarkdown'
  },
  {
    id: 'html-to-markdown',
    name: 'HTML to Markdown',
    description: 'Convert HTML to Markdown',
    category: 'converters',
    slug: 'html-to-markdown',
    icon: 'IconMarkdown'
  },
  {
    id: 'lorem-generator',
    name: 'Lorem Ipsum Generator',
    description: 'Generate Lorem Ipsum placeholder text',
    category: 'converters',
    slug: 'lorem-generator',
    icon: 'IconFileText'
  },
  {
    id: 'epoch-to-date',
    name: 'Epoch to Date',
    description: 'Convert Unix timestamp to date',
    category: 'converters',
    slug: 'epoch-to-date',
    icon: 'IconCalendar'
  },
  {
    id: 'date-to-epoch',
    name: 'Date to Epoch',
    description: 'Convert date to Unix timestamp',
    category: 'converters',
    slug: 'date-to-epoch',
    icon: 'IconClock'
  },
  {
    id: 'hex-to-rgb',
    name: 'HEX to RGB',
    description: 'Convert HEX colors to RGB',
    category: 'converters',
    slug: 'hex-to-rgb',
    icon: 'IconPalette'
  },
  {
    id: 'rgb-to-hex',
    name: 'RGB to HEX',
    description: 'Convert RGB colors to HEX',
    category: 'converters',
    slug: 'rgb-to-hex',
    icon: 'IconPalette'
  },
  {
    id: 'uuid-generator',
    name: 'UUID Generator',
    description: 'Generate random UUIDs',
    category: 'converters',
    slug: 'uuid-generator',
    icon: 'IconFingerprint',
    popular: true
  },
  {
    id: 'ascii-to-text',
    name: 'ASCII to Text',
    description: 'Convert ASCII codes to text',
    category: 'converters',
    slug: 'ascii-to-text',
    icon: 'IconFileText'
  },
  {
    id: 'text-to-ascii',
    name: 'Text to ASCII',
    description: 'Convert text to ASCII codes',
    category: 'converters',
    slug: 'text-to-ascii',
    icon: 'IconNumbers'
  },
  {
    id: 'case-converter',
    name: 'Case Converter',
    description: 'Convert text case (upper, lower, title, sentence)',
    category: 'converters',
    slug: 'case-converter',
    icon: 'IconLetterCase'
  },
  {
    id: 'slug-generator',
    name: 'Slug Generator',
    description: 'Generate URL-friendly slugs',
    category: 'converters',
    slug: 'slug-generator',
    icon: 'IconLink'
  },

  // Color Tools (8 tools)
  {
    id: 'color-picker',
    name: 'Color Picker',
    description: 'Pick and convert colors between formats',
    category: 'colors',
    slug: 'color-picker',
    icon: 'IconColorPicker',
    popular: true
  },
  {
    id: 'gradient-generator',
    name: 'Gradient Generator',
    description: 'Generate CSS gradients',
    category: 'colors',
    slug: 'gradient-generator',
    icon: 'IconColorSwatch'
  },
  {
    id: 'random-color',
    name: 'Random Color Generator',
    description: 'Generate random colors',
    category: 'colors',
    slug: 'random-color',
    icon: 'IconDice'
  },
  {
    id: 'shade-generator',
    name: 'Shade Generator',
    description: 'Generate color shades',
    category: 'colors',
    slug: 'shade-generator',
    icon: 'IconAdjustments'
  },
  {
    id: 'tint-generator',
    name: 'Tint Generator',
    description: 'Generate color tints',
    category: 'colors',
    slug: 'tint-generator',
    icon: 'IconSun'
  },
  {
    id: 'palette-extractor',
    name: 'Palette Extractor',
    description: 'Extract color palette from image',
    category: 'colors',
    slug: 'palette-extractor',
    icon: 'IconPhoto'
  },
  {
    id: 'contrast-checker',
    name: 'Contrast Checker',
    description: 'Check color contrast ratios',
    category: 'colors',
    slug: 'contrast-checker',
    icon: 'IconEye'
  },
  {
    id: 'hsl-hex-converter',
    name: 'HSL ↔ HEX Converter',
    description: 'Convert between HSL and HEX colors',
    category: 'colors',
    slug: 'hsl-hex-converter',
    icon: 'IconRefresh'
  },

  // Text Utilities (10 tools)
  {
    id: 'word-counter',
    name: 'Word Counter',
    description: 'Count words, characters, and lines',
    category: 'text',
    slug: 'word-counter',
    icon: 'IconNumbers',
    popular: true
  },
  {
    id: 'character-counter',
    name: 'Character Counter',
    description: 'Count characters with/without spaces',
    category: 'text',
    slug: 'character-counter',
    icon: 'IconLetterCase'
  },
  {
    id: 'remove-duplicates',
    name: 'Remove Duplicate Lines',
    description: 'Remove duplicate lines from text',
    category: 'text',
    slug: 'remove-duplicates',
    icon: 'IconCopy'
  },
  {
    id: 'sort-lines',
    name: 'Sort Lines',
    description: 'Sort text lines alphabetically',
    category: 'text',
    slug: 'sort-lines',
    icon: 'IconSortAZ'
  },
  {
    id: 'reverse-text',
    name: 'Reverse Text',
    description: 'Reverse text or lines',
    category: 'text',
    slug: 'reverse-text',
    icon: 'IconArrowsHorizontal'
  },
  {
    id: 'remove-spaces',
    name: 'Remove Extra Spaces',
    description: 'Remove extra whitespace from text',
    category: 'text',
    slug: 'remove-spaces',
    icon: 'IconSpacing'
  },
  {
    id: 'extract-emails',
    name: 'Extract Emails',
    description: 'Extract email addresses from text',
    category: 'text',
    slug: 'extract-emails',
    icon: 'IconMail'
  },
  {
    id: 'extract-urls',
    name: 'Extract URLs',
    description: 'Extract URLs from text',
    category: 'text',
    slug: 'extract-urls',
    icon: 'IconLink'
  },
  {
    id: 'find-replace',
    name: 'Find & Replace',
    description: 'Find and replace text patterns',
    category: 'text',
    slug: 'find-replace',
    icon: 'IconSearch'
  },
  {
    id: 'sentence-case',
    name: 'Sentence Case Fixer',
    description: 'Fix sentence capitalization',
    category: 'text',
    slug: 'sentence-case',
    icon: 'IconLetterCase'
  },

  // File Tools (5 tools)
  {
    id: 'image-compressor',
    name: 'Image Compressor',
    description: 'Compress images to reduce file size',
    category: 'files',
    slug: 'image-compressor',
    icon: 'IconPhoto'
  },
  {
    id: 'image-resizer',
    name: 'Image Resizer',
    description: 'Resize images to specific dimensions',
    category: 'files',
    slug: 'image-resizer',
    icon: 'IconArrowsMaximize'
  },
  {
    id: 'pdf-to-text',
    name: 'PDF to Text',
    description: 'Extract text from PDF files',
    category: 'files',
    slug: 'pdf-to-text',
    icon: 'IconFilePdf'
  },
  {
    id: 'text-to-pdf',
    name: 'Text to PDF',
    description: 'Convert text to PDF file',
    category: 'files',
    slug: 'text-to-pdf',
    icon: 'IconFilePdf'
  },
  {
    id: 'json-to-file',
    name: 'JSON to File',
    description: 'Download JSON data as file',
    category: 'files',
    slug: 'json-to-file',
    icon: 'IconDownload'
  },

  // Code Tools (6 tools)
  {
    id: 'regex-tester',
    name: 'Regex Tester',
    description: 'Test regular expressions',
    category: 'code',
    slug: 'regex-tester',
    icon: 'IconCode',
    popular: true
  },
  {
    id: 'diff-checker',
    name: 'Diff Checker',
    description: 'Compare text differences',
    category: 'code',
    slug: 'diff-checker',
    icon: 'IconGitBranch'
  },
  {
    id: 'markdown-previewer',
    name: 'Markdown Previewer',
    description: 'Preview Markdown in real-time',
    category: 'code',
    slug: 'markdown-previewer',
    icon: 'IconMarkdown'
  },
  {
    id: 'xml-viewer',
    name: 'XML Viewer',
    description: 'View XML in tree structure',
    category: 'code',
    slug: 'xml-viewer',
    icon: 'IconFileCode'
  },
  {
    id: 'html-previewer',
    name: 'HTML Previewer',
    description: 'Preview HTML code safely',
    category: 'code',
    slug: 'html-previewer',
    icon: 'IconBrowser'
  },
  {
    id: 'css-gradient-previewer',
    name: 'CSS Gradient Previewer',
    description: 'Preview CSS gradients',
    category: 'code',
    slug: 'css-gradient-previewer',
    icon: 'IconColorSwatch'
  },

  // System Tools (4 tools)
  {
    id: 'qr-generator',
    name: 'QR Code Generator',
    description: 'Generate QR codes from text',
    category: 'system',
    slug: 'qr-generator',
    icon: 'IconQrcode',
    popular: true
  },
  {
    id: 'qr-scanner',
    name: 'QR Code Scanner',
    description: 'Scan QR codes using camera',
    category: 'system',
    slug: 'qr-scanner',
    icon: 'IconScan'
  },
  {
    id: 'password-strength',
    name: 'Password Strength Checker',
    description: 'Check password strength and security',
    category: 'system',
    slug: 'password-strength',
    icon: 'IconShield'
  },
  {
    id: 'device-info',
    name: 'Device Info Detector',
    description: 'Detect device and browser information',
    category: 'system',
    slug: 'device-info',
    icon: 'IconDeviceDesktop'
  }
];

export const getToolsByCategory = (categorySlug: string) => {
  return tools.filter(tool => tool.category === categorySlug);
};

export const getPopularTools = () => {
  return tools.filter(tool => tool.popular);
};

export const getToolBySlug = (slug: string) => {
  return tools.find(tool => tool.slug === slug);
};

export const getCategoryBySlug = (slug: string) => {
  return categories.find(category => category.slug === slug);
};

export const searchTools = (query: string) => {
  const lowercaseQuery = query.toLowerCase();
  return tools.filter(tool => 
    tool.name.toLowerCase().includes(lowercaseQuery) ||
    tool.description.toLowerCase().includes(lowercaseQuery)
  );
};