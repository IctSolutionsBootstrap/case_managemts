import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono, Noto_Sans_Ethiopic } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { I18nProvider } from '@/lib/i18n/context'
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
  title: 'Ministry of Justice - Jijiga | የፍትህ ሚኒስቴር - ጅጅጋ',
  description: 'Public Portal for Case Management and Citizen Services - Somali Regional State Ministry of Justice',
  generator: 'v0.app',
  keywords: ['Ministry of Justice', 'Jijiga', 'Somali Region', 'Case Management', 'Legal Services', 'Ethiopia'],
  authors: [{ name: 'Ministry of Justice - Somali Regional State' }],
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
  themeColor: '#d946a5',
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
        <I18nProvider>
          {children}
        </I18nProvider>
        <Analytics />
      </body>
    </html>
  )
}
