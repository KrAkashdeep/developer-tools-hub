import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://multidevtool.vercel.app'
  const currentDate = new Date().toISOString().split('T')[0]

  // Main pages
  const mainPages = [
    {
      url: baseUrl,
      lastModified: currentDate,
      changeFrequency: 'daily' as const,
      priority: 1.0,
    },
    {
      url: `${baseUrl}/tools`,
      lastModified: currentDate,
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/docs`,
      lastModified: currentDate,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
  ]

  // Category pages
  const categories = [
    'formatters', 'validators', 'encoders', 'converters', 
    'colors', 'text', 'files', 'code', 'system'
  ]
  
  const categoryPages = categories.map(category => ({
    url: `${baseUrl}/category/${category}`,
    lastModified: currentDate,
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  // Popular tools (higher priority)
  const popularTools = [
    'json-formatter', 'json-validator', 'base64-encode', 'uuid-generator',
    'color-picker', 'word-counter', 'regex-tester', 'qr-generator'
  ]
  
  const popularToolPages = popularTools.map(tool => ({
    url: `${baseUrl}/tools/${tool}`,
    lastModified: currentDate,
    changeFrequency: 'weekly' as const,
    priority: 0.9,
  }))

  // All other tools
  const otherTools = [
    'json-minifier', 'html-formatter', 'html-minifier', 'css-formatter',
    'css-minifier', 'js-formatter', 'js-minifier', 'sql-beautifier',
    'xml-formatter', 'html-validator', 'css-validator', 'url-validator',
    'email-validator', 'ip-validator', 'uuid-validator', 'credit-card-validator',
    'base64-decode', 'url-encode', 'url-decode', 'html-encode', 'html-decode',
    'jwt-decoder', 'morse-encode', 'morse-decode', 'gzip-compress',
    'gzip-decompress', 'hash-generator', 'json-to-csv', 'csv-to-json',
    'json-to-xml', 'xml-to-json', 'markdown-to-html', 'html-to-markdown',
    'lorem-generator', 'epoch-to-date', 'date-to-epoch', 'hex-to-rgb',
    'rgb-to-hex', 'ascii-to-text', 'text-to-ascii', 'case-converter',
    'slug-generator', 'gradient-generator', 'random-color', 'shade-generator',
    'tint-generator', 'palette-extractor', 'contrast-checker', 'hsl-hex-converter',
    'character-counter', 'remove-duplicates', 'sort-lines', 'reverse-text',
    'remove-spaces', 'extract-emails', 'extract-urls', 'find-replace',
    'sentence-case', 'image-compressor', 'image-resizer', 'pdf-to-text',
    'text-to-pdf', 'json-to-file', 'diff-checker', 'markdown-previewer',
    'xml-viewer', 'html-previewer', 'css-gradient-previewer', 'qr-scanner',
    'password-strength', 'device-info'
  ]
  
  const otherToolPages = otherTools.map(tool => ({
    url: `${baseUrl}/tools/${tool}`,
    lastModified: currentDate,
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }))

  return [
    ...mainPages,
    ...categoryPages,
    ...popularToolPages,
    ...otherToolPages,
  ]
}