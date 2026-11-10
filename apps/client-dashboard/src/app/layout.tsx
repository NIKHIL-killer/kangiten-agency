import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Kangiten Dashboard',
  description: 'Manage your WhatsApp AI assistant',
}

export default function RootLayout({
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
      <body className="min-h-screen bg-muted/30 font-sans">{children}</body>
    </html>
  )
}