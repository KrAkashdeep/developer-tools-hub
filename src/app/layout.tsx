import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/lib/contexts/theme-context";
import { Header, Footer } from "@/components/layout";
import { ErrorBoundary, BrowserCompatInit } from "@/components/common";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "multiDevtools - 80+ Developer Tools Suite",
    template: "%s | multiDevtools"
  },
  description: "Complete developer toolkit with 80+ tools for formatting, converting, encoding, and more. Fast, free, and works entirely in your browser. JSON formatter, Base64 encoder, color converter, and many more.",
  keywords: [
    "developer tools",
    "web development",
    "json formatter",
    "base64 encoder",
    "color converter",
    "text utilities",
    "code formatter",
    "online tools",
    "free tools",
    "programming tools"
  ],
  authors: [{ name: "multiDevtools" }],
  creator: "multiDevtools",
  publisher: "multiDevtools",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://multidevtools.com',
    siteName: 'multiDevtools',
    title: 'multiDevtools - 80+ Developer Tools Suite',
    description: 'Complete developer toolkit with 80+ tools for formatting, converting, encoding, and more. Fast, free, and works entirely in your browser.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'multiDevtools - Developer Tools Suite',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'multiDevtools - 80+ Developer Tools Suite',
    description: 'Complete developer toolkit with 80+ tools for formatting, converting, encoding, and more.',
    images: ['/og-image.png'],
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
  },
  verification: {
    google: 'your-google-verification-code',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
      >
        <ErrorBoundary>
          <ThemeProvider defaultTheme="system">
            <BrowserCompatInit />
            <ErrorBoundary>
              <Header />
            </ErrorBoundary>
            <main className="flex-1">
              <ErrorBoundary>
                {children}
              </ErrorBoundary>
            </main>
            <ErrorBoundary>
              <Footer />
            </ErrorBoundary>
          </ThemeProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
