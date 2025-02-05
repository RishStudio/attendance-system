import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Providers } from './providers';
import { Navbar } from '@/components/ui/navbar';
import { Footer } from '@/components/ui/footer';
import { ParticlesBackground } from '@/components/ui/particles';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Prefect Board Attendance System',
  description: 'Modern attendance tracking system for school prefects',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="https://cdn.imrishmika.site/images/v2.png" />
      </head>
      <body className={inter.className}>
        <Providers>
          <div className="relative min-h-screen flex flex-col">
            <Navbar />
            <ParticlesBackground />
            <main className="flex-1 container mx-auto">{children}</main>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}