export function Footer() {
  return (
    <footer className="w-full border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="flex flex-1 items-center justify-between">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Rishmika Sandanu. All rights reserved. This is Made For Prefect Board of MRCM
          </p>
        </div>
      </div>
    </footer>
  );
}