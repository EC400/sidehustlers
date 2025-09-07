// src/app/layout.tsx - Erweiterte Root Layout
import "./globals.css";
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'SideHustlers - Professionelle Dienstleistungen in Ihrer Nähe',
  description: 'Verbinden Sie sich mit qualifizierten Dienstleistern in Ihrer Region. Professionell, vertrauensvoll und direkt vor Ort.',
  keywords: 'Dienstleister, Handwerk, Services, lokale Experten, Haushaltshilfe',
  viewport: 'width=device-width, initial-scale=1',
  themeColor: '#0A1B3D',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="de">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
        <meta name="theme-color" content="#0A1B3D" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      </head>
      <body className="min-h-screen bg-[#F8FAFC] antialiased">
        <div className="flex min-h-screen flex-col">
          <main className="flex-1 w-full">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}