import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Company Summarizer Demo',
  description: 'Demo of AI-powered company summarizer using OpenAI GPT and Google Sheets',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}