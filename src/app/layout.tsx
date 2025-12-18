import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/lib/contexts/theme-context";
import { Header, Footer } from "@/components/layout";
import { ErrorBoundary, BrowserCompatInit } from "@/components/common";
import { Analytics } from '@vercel/analytics/react';
import GoogleAnalytics from '@/components/common/GoogleAnalytics';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://multidevtool.vercel.app'),
  title: {
    default: "multidevTools - 80+ Developer Tools Suite",
    template: "%s | multidevTools"
  },
  icons: {
    icon: '/icon.svg',
    shortcut: '/icon.svg',
    apple: '/icon.svg',
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
  authors: [{ name: "multidevTools" }],
  creator: "multidevTools",
  publisher: "multidevTools",
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
    url: '/',
    siteName: 'multidevTools',
    title: 'multidevTools - 80+ Developer Tools Suite',
    description: 'Complete developer toolkit with 80+ tools for formatting, converting, encoding, and more. Fast, free, and works entirely in your browser.',
    images: [
      {
        url: '/icon.svg',
        width: 1200,
        height: 630,
        alt: 'multidevTools - Developer Tools Suite',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'multidevTools - 80+ Developer Tools Suite',
    description: 'Complete developer toolkit with 80+ tools for formatting, converting, encoding, and more.',
    images: ['/icon.svg'],
  },
  verification: {
    google: '1UxP5g9Q6CrhwNhaSghO3e3ss9PpI0F0NpImNkCEaRQ',
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <style dangerouslySetInnerHTML={{
          __html: `
            /* Circular favicon styling */
            link[rel="icon"] {
              border-radius: 50% !important;
              background: white !important;
              padding: 2px !important;
            }
            
            /* Browser tab favicon circular styling */
            img[src*="icon.svg"] {
              border-radius: 50% !important;
              background: white !important;
            }
          `
        }} />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
      >
        <ErrorBoundary>
          <ThemeProvider defaultTheme="system">
            <BrowserCompatInit />
            <GoogleAnalytics />
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
        <Analytics />
      </body>
    </html>
  );
}
