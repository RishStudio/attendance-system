"use client"

import React from "react"
import { Facebook, Instagram, Twitter, Linkedin } from "lucide-react"

interface SocialLinkProps {
  href: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  label: string;
}

interface FooterLinkProps {
  href: string;
  label: string;
}

interface FooterSectionProps {
  title: string;
  children: React.ReactNode;
}

export default function Footer() {
  return (
    <footer className="bg-gray-100 shadow-md mt-8">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="xl:grid xl:grid-cols-3 xl:gap-8">
          <div className="space-y-8 xl:col-span-1">
            <h2 className="text-2xl font-bold text-black">Mahinda Rajapaksha College Attendance System</h2>
            <p className="text-gray-700 text-base">
              Streamlining attendance tracking for MRCM prefects. Powered by Rish Studio.
            </p>
            <div className="flex space-x-6">
              <SocialLink href="https://web.facebook.com/p/Board-of-prefects-MRCM-100057210318764/" icon={Facebook} label="Facebook" />
              <SocialLink href="https://www.instagram.com/mrcm_prefects/" icon={Instagram} label="Instagram" />
              <SocialLink href="https://twitter.com/" icon={Twitter} label="Twitter" />
              <SocialLink href="https://www.linkedin.com/" icon={Linkedin} label="LinkedIn" />
            </div>
          </div>
          <div className="mt-12 xl:mt-0 xl:col-span-2 text-gray-700">
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <FooterSection title="Rish Studio">
                <FooterLink href="https://imrishmika.site/#about/" label="About" />
                <FooterLink href="https://imrishmika.site/#projects" label="Projects" />
                <FooterLink href="https://imrishmika.site/#pricing" label="Hire Me" />
              </FooterSection>
              <FooterSection title="Legal">
                <FooterLink href="/policy" label="Privacy Policy" />
                <FooterLink href="/terms" label="Terms of Service" />
              </FooterSection>
            </div>
          </div>
        </div>
        <div className="mt-12 border-t border-gray-300 pt-8 text-center">
          <p className="text-base text-gray-600">&copy; 2025 MRCM Prefect Board. All rights reserved.</p>
          <p className="text-sm text-gray-500">Developed by <a href="https://imrishmika.site" className="hover:text-gray-700">Rishmika Sandanu</a></p>
        </div>
      </div>
    </footer>
  );
}

function SocialLink({ href, icon: Icon, label }: SocialLinkProps) {
  return (
    <a href={href} className="text-gray-500 hover:text-gray-700" aria-label={label}>
      <Icon className="h-6 w-6" />
    </a>
  );
}

function FooterSection({ title, children }: FooterSectionProps) {
  return (
    <div className="mt-12 md:mt-0">
      <h3 className="text-sm font-semibold text-gray-600 tracking-wider uppercase">{title}</h3>
      <ul className="mt-4 space-y-4">
        {children}
      </ul>
    </div>
  );
}

function FooterLink({ href, label }: FooterLinkProps) {
  return (
    <li>
      <a href={href} className="text-base hover:text-gray-700">
        {label}
      </a>
    </li>
  );
}