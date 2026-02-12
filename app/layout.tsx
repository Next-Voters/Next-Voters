import { type Metadata } from 'next'
import { Plus_Jakarta_Sans } from 'next/font/google'
import './globals.css'
import Root from '@/components/common/root'
import { AuthProvider } from '@/wrappers/AuthProvider'

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-plus-jakarta-sans',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Next Voters |Civic Education & Policy Analysis',
  description:
    'Next Voters is a civic education platform helping students and young voters understand legislation, public policy, and North American politics through clear summaries and nonpartisan analysis.',

  keywords: [
    'civic education',
    'political literacy',
    'public policy explained',
    'legislation summaries',
    'voter education',
    'youth politics',
    'North American politics',
    'nonpartisan political analysis',
    'student civic engagement',
    'policy analysis',
  ],

  robots: {
    index: true,
    follow: true,
  },

  openGraph: {
    title: 'Next Voters | Civic Education',
    description:
      'Understand legislation and public policy with summaries built for students and everyday voters.',
    type: 'website',
    locale: 'en_US',
    siteName: 'Next Voters',
  },

  twitter: {
    card: 'summary_large_image',
    title: 'Next Voters | Civic Education',
    description:
      'Explanations of legislation and public policy for the next generation of voters.',
  },
}


export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthProvider>
    <html lang="en" className={plusJakartaSans.variable}>
      <body className={`antialiased`}>
        <Root>{children}</Root>
      </body>
    </html>
    </AuthProvider>
  )
}
