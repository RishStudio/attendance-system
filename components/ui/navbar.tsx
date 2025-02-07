'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Shield, Sun, Moon, Menu, X, ClipboardList, FileText, User, Clock } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Button } from './button';

export function Navbar() {
  const { theme, setTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 flex h-14 items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <Shield className="h-6 w-6" />
          <span className="hidden sm:inline-block font-bold">
            Prefect Board
          </span>
        </Link>

        <nav className="flex items-center space-x-2">
          <div className="hidden sm:flex space-x-2">
            <Link href="/">
              <Button variant="ghost" size="sm">
                <ClipboardList className="mr-2 h-4 w-4" />
                Attendance
              </Button>
            </Link>
            <Link href="/docs">
              <Button variant="ghost" size="sm">
                <FileText className="mr-2 h-4 w-4" />
                Documentation
              </Button>
            </Link>
            <Link href="/admin">
              <Button variant="ghost" size="sm">
                <User className="mr-2 h-4 w-4" />
                Admin
              </Button>
            </Link>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="relative"
          >
            <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="sm:hidden"
            onClick={toggleMenu}
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            <span className="sr-only">Toggle menu</span>
          </Button>
        </nav>
      </div>

      {isOpen && (
        <div className="sm:hidden mt-2">
          <nav className="flex flex-col items-start space-y-2 px-4">
            <Link href="/">
              <Button variant="ghost" size="sm" onClick={toggleMenu}>
                <ClipboardList className="mr-2 h-4 w-4" />
                Attendance
              </Button>
            </Link>
            <Link href="/docs">
              <Button variant="ghost" size="sm" onClick={toggleMenu}>
                <FileText className="mr-2 h-4 w-4" />
                Documentation
              </Button>
            </Link>
            <Link href="/admin">
              <Button variant="ghost" size="sm" onClick={toggleMenu}>
                <User className="mr-2 h-4 w-4" />
                Admin
              </Button>
            </Link>
            <Link href="/time">
              <Button variant="ghost" size="sm" onClick={toggleMenu}>
                <Clock className="mr-2 h-4 w-4" />
                Manual Attendance (Beta)
              </Button>
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}