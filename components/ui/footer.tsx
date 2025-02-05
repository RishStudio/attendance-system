import React from 'react';

export function Footer() {
  return (
    <footer className="w-full border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 py-4 flex flex-col sm:flex-row items-center justify-between space-y-2 sm:space-y-0">
        <p className="text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} Prefect Board. All rights reserved.
        </p>
        <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4">
          <a
            href="#"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Privacy Policy
          </a>
          <a
            href="#"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Terms of Service
          </a>
        </div>
      </div>
      <div className="container mx-auto px-4 py-2 flex flex-col sm:flex-row items-center justify-between space-y-2 sm:space-y-0">
        <p className="text-center text-sm text-muted-foreground">
          Developed by <a href="https://imrishmika.site" className="text-foreground hover:underline">Rishmika Sandanu</a>
        </p>
      </div>
    </footer>
  );
}