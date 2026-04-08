import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono, Noto_Sans_Ethiopic } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { I18nProvider } from '@/lib/i18n/context'
import { AuthProvider } from '@/lib/auth/context'
import './globals.css'

const _geist = Geist({ 
  subsets: ["latin"],
  variable: '--font-geist',
})
const _geistMono = Geist_Mono({ 
  subsets: ["latin"],
  variable: '--font-geist-mono',
})
const _notoEthiopic = Noto_Sans_Ethiopic({
  subsets: ['ethiopic'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-ethiopic',
})

export const metadata: Metadata = {
  title: 'Jijiga Regional Bureau of Justice - Case Management System',
  description: 'Integrated Case Management System for the Jijiga Regional Bureau of Justice - Somali Regional State, Ethiopia',
  generator: 'v0.app',
  keywords: ['Bureau of Justice', 'Jijiga', 'Somali Region', 'Case Management', 'Legal Services', 'Ethiopia', 'FIR', 'Court'],
  authors: [{ name: 'Jijiga Regional Bureau of Justice' }],
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export const viewport: Viewport = {
  themeColor: '#1a365d',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="am" suppressHydrationWarning>
      <body className={`${_geist.variable} ${_geistMono.variable} ${_notoEthiopic.variable} font-sans antialiased`}>
        <AuthProvider>
          <I18nProvider>
            {children}
          </I18nProvider>
        </AuthProvider>
        <Analytics />
      </body>
    </html>
  )
}
