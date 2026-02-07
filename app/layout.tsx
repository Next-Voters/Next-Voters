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
  title: 'Next-Voters',
  description: 'Next-Voters',
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
