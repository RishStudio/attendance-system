import React from 'react';

export function Footer() {
  return (
    <footer className="w-full border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 py-8 flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
        <div className="flex flex-col sm:flex-row items-center justify-between w-full sm:w-auto space-y-4 sm:space-y-0 sm:space-x-8">
          <div className="text-center sm:text-left">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} Prefect Board. All rights reserved.
            </p>
          </div>
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
            <a
              href="#"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Contact Us
            </a>
          </div>
        </div>
      </div>
      <div className="container mx-auto px-4 py-4 flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0 border-t border-muted-foreground">
        <div className="flex flex-col sm:flex-row items-center w-full sm:w-auto space-y-4 sm:space-y-0 sm:space-x-8">
          <div className="text-center sm:text-left">
            <p className="text-sm text-muted-foreground">
              Developed by <a href="https://imrishmika.site" className="text-foreground hover:underline">Rishmika Sandanu</a>
            </p>
          </div>
          <div className="flex space-x-4">
            <a href="https://twitter.com/imrishmika" className="text-muted-foreground hover:text-foreground transition-colors">
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M24 4.557a9.9 9.9 0 01-2.828.775 4.932 4.932 0 002.165-2.724 9.837 9.837 0 01-3.127 1.197 4.918 4.918 0 00-8.384 4.482 13.978 13.978 0 01-10.148-5.144 4.822 4.822 0 00-.665 2.475c0 1.707.869 3.213 2.188 4.099a4.905 4.905 0 01-2.228-.616c-.054 1.98 1.394 3.83 3.447 4.241a4.935 4.935 0 01-2.224.085 4.927 4.927 0 004.6 3.417 9.867 9.867 0 01-6.102 2.104c-.395 0-.787-.023-1.175-.068a13.945 13.945 0 007.548 2.212c9.054 0 14.009-7.496 14.009-13.986 0-.213-.004-.425-.014-.636a10.025 10.025 0 002.457-2.548l.002-.003z"></path>
              </svg>
              <span className="sr-only">Twitter</span>
            </a>
            <a href="https://github.com/imrishmika" className="text-muted-foreground hover:text-foreground transition-colors">
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12 2a10 10 0 00-3.16 19.49c.5.09.67-.22.67-.48v-1.7c-2.79.61-3.38-1.35-3.38-1.35-.45-1.15-1.11-1.46-1.11-1.46-.91-.62.07-.61.07-.61 1 .07 1.53 1.02 1.53 1.02.9 1.55 2.36 1.1 2.94.84.09-.65.35-1.09.63-1.34-2.23-.25-4.56-1.11-4.56-4.93 0-1.09.39-1.98 1.02-2.68-.1-.25-.44-1.28.1-2.67 0 0 .83-.27 2.74 1.02a9.54 9.54 0 012.5-.34 9.55 9.55 0 012.5.34c1.91-1.29 2.74-1.02 2.74-1.02.54 1.39.2 2.42.1 2.67.63.7 1.02 1.59 1.02 2.68 0 3.83-2.34 4.67-4.57 4.92.36.31.68.94.68 1.89 0 1.37-.01 2.47-.01 2.82 0 .27.18.58.68.48A10 10 0 0012 2z"></path>
              </svg>
              <span className="sr-only">GitHub</span>
            </a>
            <a href="mailto:rishmika@example.com" className="text-muted-foreground hover:text-foreground transition-colors">
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12 12.713l11.95-7.193A2 2 0 0022 4H2a2 2 0 00-1.95 1.52L12 12.713zm0 2.574L.05 8.094A2 2 0 002 20h20a2 2 0 001.95-2.906L12 15.287z"></path>
              </svg>
              <span className="sr-only">Email</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}