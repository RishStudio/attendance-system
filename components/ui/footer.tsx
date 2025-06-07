'use client';

import Link from 'next/link';
import { Github, Twitter, Linkedin, Mail, Phone, MapPin, Shield, FileText, Users, Clock } from 'lucide-react';

export function Footer() {
  return (
    <footer className="w-full border-t bg-background/95 backdrop-blur-xl border-white/10">
      <div className="container mx-auto px-4 py-8">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Shield className="h-6 w-6 text-primary" />
              <span className="font-bold text-lg">MRCM Prefect Board</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Modern attendance tracking system for Mahinda Rajapaksha College Matara Prefect Board. 
              Streamlined, secure, and efficient.
            </p>
            <div className="flex space-x-3">
              <a 
                href="https://github.com/RishBroProMax" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-background/50 border border-white/10 hover:bg-background/80 transition-all duration-200 backdrop-blur-sm"
              >
                <Github className="h-4 w-4" />
              </a>
              <a 
                href="https://twitter.com/imrishmika" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-background/50 border border-white/10 hover:bg-background/80 transition-all duration-200 backdrop-blur-sm"
              >
                <Twitter className="h-4 w-4" />
              </a>
              <a 
                href="https://linkedin.com/in/imrishmika" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-background/50 border border-white/10 hover:bg-background/80 transition-all duration-200 backdrop-blur-sm"
              >
                <Linkedin className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Quick Navigation */}
          <div className="space-y-4">
            <h3 className="font-semibold text-sm uppercase tracking-wider">Quick Navigation</h3>
            <nav className="space-y-2">
              <Link href="/" className="flex items-center space-x-2 text-sm text-muted-foreground hover:text-foreground transition-colors duration-200">
                <Shield className="h-3 w-3" />
                <span>Mark Attendance</span>
              </Link>
              <Link href="/manual" className="flex items-center space-x-2 text-sm text-muted-foreground hover:text-foreground transition-colors duration-200">
                <Clock className="h-3 w-3" />
                <span>Manual Entry</span>
              </Link>
              <Link href="/qr" className="flex items-center space-x-2 text-sm text-muted-foreground hover:text-foreground transition-colors duration-200">
                <Users className="h-3 w-3" />
                <span>QR Scanner</span>
              </Link>
              <Link href="/admin" className="flex items-center space-x-2 text-sm text-muted-foreground hover:text-foreground transition-colors duration-200">
                <Users className="h-3 w-3" />
                <span>Admin Dashboard</span>
              </Link>
              <Link href="/docs" className="flex items-center space-x-2 text-sm text-muted-foreground hover:text-foreground transition-colors duration-200">
                <FileText className="h-3 w-3" />
                <span>Documentation</span>
              </Link>
            </nav>
          </div>

          {/* Contact Information */}
          <div className="space-y-4">
            <h3 className="font-semibold text-sm uppercase tracking-wider">Contact</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Mail className="h-3 w-3" />
                <a href="mailto:contact@imrishmika.site" className="hover:text-foreground transition-colors duration-200">
                  contact@imrishmika.site
                </a>
              </div>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Phone className="h-3 w-3" />
                <span>+94 77 123 4567</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <MapPin className="h-3 w-3" />
                <span>Mahinda Rajapaksha College, Matara</span>
              </div>
            </div>
          </div>

          {/* Legal & Support */}
          <div className="space-y-4">
            <h3 className="font-semibold text-sm uppercase tracking-wider">Support</h3>
            <nav className="space-y-2">
              <a href="#" className="block text-sm text-muted-foreground hover:text-foreground transition-colors duration-200">
                Privacy Policy
              </a>
              <a href="#" className="block text-sm text-muted-foreground hover:text-foreground transition-colors duration-200">
                Terms of Service
              </a>
              <a href="#" className="block text-sm text-muted-foreground hover:text-foreground transition-colors duration-200">
                Help Center
              </a>
              <a href="https://imrishmika.site" target="_blank" rel="noopener noreferrer" className="block text-sm text-muted-foreground hover:text-foreground transition-colors duration-200">
                Developer Portfolio
              </a>
            </nav>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-6 border-t border-white/10">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-sm text-muted-foreground text-center md:text-left">
              © {new Date().getFullYear()} <a href="https://rylix.imrishmika.site" className="text-foreground hover:text-primary transition-colors duration-200">Rylix Solution</a> & <a href="https://imrishmika.site" className="text-foreground hover:text-primary transition-colors duration-200">ImRishmika</a>. All rights reserved.
            </div>
            <div className="text-sm text-muted-foreground text-center md:text-right">
              Made with ❤️ for MRCM Prefect Board
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}