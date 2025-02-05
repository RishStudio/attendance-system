export function Footer() {
  return (
    <footer className="w-full border-t bg-neutral-100">
      <div className="container flex h-14 items-center">
        <div className="flex flex-1 items-center justify-between">
          <p className="text-sm text-gray-600">
            © {new Date().getFullYear()} Rishmika Sandanu. All rights reserved. This is Made For Prefect Board of MRCM
          </p>
        </div>
      </div>
    </footer>
  );
}