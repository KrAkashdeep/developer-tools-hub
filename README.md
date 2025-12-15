# multiDevtools

A comprehensive web-based developer tools suite providing 80+ tools including formatters, converters, encoders/decoders, validators, color utilities, and text utilities. Built with Next.js 16, TypeScript, and Tailwind CSS.

## Features

- 🔧 80+ developer tools in one place
- 🎨 Modern, responsive design with dark/light mode
- ⚡ Real-time processing with instant results
- 🔍 Smart search with autocomplete
- 📱 Mobile-optimized interface
- 🎯 Category-based tool organization
- 🚀 Fast, client-side processing

## Tech Stack

- **Framework**: Next.js 16 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **UI Components**: ShadCN UI
- **Icons**: Tabler Icons
- **Deployment**: Vercel (recommended)

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── app/                 # Next.js App Router pages
├── components/
│   ├── ui/             # ShadCN UI components
│   ├── layout/         # Header, Footer, Navigation
│   ├── search/         # Search and autocomplete
│   ├── tools/          # Tool-specific components
│   └── common/         # Reusable components
└── lib/
    ├── utils/          # Utility functions for tools
    ├── data/           # Tool and category definitions
    └── types/          # TypeScript type definitions
```

## Development

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## License

This project is open source and available under the MIT License.