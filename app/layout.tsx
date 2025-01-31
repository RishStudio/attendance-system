import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "BOP Attendance System",
  description: "Rishmika Idea Fixed by Vimukthi Indunil",
  keywords: "attendance, system, BOP, Rishmika, Vimukthi, tracking, management",
  authors: [{ name: "Rishmika and Vimukthi Indunil" }], // Fixed property name
  viewport: "width=device-width, initial-scale=1.0",
  robots: "index, follow",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="robots" content="index, follow" />
        <meta name="author" content="Rishmika and Vimukthi Indunil" />
        <meta name="keywords" content="attendance, system, BOP, Rishmika, Vimukthi, tracking, management" />
        <meta name="description" content="Idea From Rishmika Sandanu & Bug Fixed by Vimukthi Indunil" />
        <link rel="icon" href="https://cdn.imrishmika.site/images/attendance.png" />
        <title>BOP Attendance System</title>
      </head>
      <body
        className={`${inter.className} bg-background text-text flex flex-col min-h-screen`}
      >
        <div className="gradient-bg"></div>
        <Navbar />
        <main className="flex-grow container mx-auto px-4 py-8 flex items-center justify-center">
          {children}
        </main>
        <Footer />
        <Toaster />
      </body>
    </html>
  );
}