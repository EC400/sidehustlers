import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { AuthProvider } from '../hooks/useAuth'
import { AuthTokenManager } from '../lib/auth-token'
import "./globals.css"

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'SideHustlers - Service Plattform',
  description: 'Finden Sie den perfekten Dienstleister oder bieten Sie Ihre Services an',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="de">
      <body className={inter.className}>
        <AuthProvider>
          {children}
        </AuthProvider>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if (typeof window !== 'undefined') {
                // Token-Management beim Laden initialisieren
                window.addEventListener('load', () => {
                  if (window.AuthTokenManager) {
                    window.AuthTokenManager.initTokenSync();
                  }
                });
              }
            `,
          }}
        />
      </body>
    </html>
  )
}