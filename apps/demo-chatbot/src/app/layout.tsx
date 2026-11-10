import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Kangiten Demo — AI WhatsApp Chatbot',
  description: 'Try our live demo of the Glow Salon AI assistant',
}

export default function DemoLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="min-h-screen bg-background font-sans">{children}</body>
    </html>
  )
}