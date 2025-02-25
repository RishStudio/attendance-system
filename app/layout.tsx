'use client';

import './globals.css';
import { Inter } from 'next/font/google';
import { useState, useEffect } from 'react';
import { Providers } from './providers';
import { Navbar } from '@/components/ui/navbar';
import { Footer } from '@/components/ui/footer';
import { ParticlesBackground } from '@/components/ui/particles';
import { FloatingClock } from '@/components/ui/floating-clock';
import { metadata } from './metadata';
import Image from 'next/image';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [showAnnouncement, setShowAnnouncement] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowAnnouncement(false);
    }, 5000); // Auto close after 5 seconds
    return () => clearTimeout(timer);
  }, []);

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="https://cdn.imrishmika.site/images/v2.png" />
        <title>{metadata.title}</title>
        <meta name="description" content={metadata.description} />
        {/* Add other metadata tags as needed */}
      </head>
      <body className={inter.className}>
        <Providers>
          <div className="relative min-h-screen flex flex-col">
            <Navbar />
            <ParticlesBackground />
            <main className="flex-1 container mx-auto">{children}</main>
            <Footer />
            <FloatingClock />

            {showAnnouncement && (
              <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50">
                <div className="relative">
                  <img
                    src="/version12.png"
                    alt="New Version Announcement"
                    className="w-96 h-auto"
                  />
                  <button
                    onClick={() => setShowAnnouncement(false)}
                    className="absolute top-2 right-2 text-white bg-red-600 hover:bg-red-800 p-2 rounded-full"
                  >
                    &times;
                  </button>
                </div>
              </div>
            )}
          </div>
        </Providers>
      </body>
    </html>
  );
}