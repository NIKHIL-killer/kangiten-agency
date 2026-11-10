import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: {
    default: 'Kangiten Agency — AI WhatsApp Chatbots for Local Businesses',
    template: '%s | Kangiten Agency',
  },
  description: 'We build AI-powered WhatsApp chatbots that book appointments, answer FAQs, and capture leads 24/7 for local businesses. First month free.',
  keywords: ['WhatsApp chatbot', 'AI automation', 'local business', 'lead generation', 'customer support'],
  authors: [{ name: 'Kangiten Agency' }],
  creator: 'Kangiten Agency',
  publisher: 'Kangiten Agency',
  robots: 'index, follow',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://kangiten.com',
    siteName: 'Kangiten Agency',
    title: 'Kangiten Agency — AI WhatsApp Chatbots for Local Businesses',
    description: 'We build AI-powered WhatsApp chatbots that book appointments, answer FAQs, and capture leads 24/7 for local businesses.',
    images: [
      {
        url: '/og-default.png',
        width: 1200,
        height: 630,
        alt: 'Kangiten Agency - AI WhatsApp Chatbots',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Kangiten Agency — AI WhatsApp Chatbots',
    description: 'We build AI-powered WhatsApp chatbots for local businesses.',
    images: ['/og-default.png'],
    creator: '@kangiten',
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0f172a' },
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} antialiased`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="min-h-screen bg-background font-sans">{children}</body>
    </html>
  )
}