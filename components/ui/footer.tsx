export function Footer() {
  return (
    <footer className="w-full border-t bg-gray-900">
      <div className="container mx-auto px-4 py-2 flex flex-col sm:flex-row items-center justify-between">
        <p className="text-sm text-gray-300 text-center sm:text-left">
          © {new Date().getFullYear()} <a href="https://imrishmika.site" className="text-blue-400 hover:underline">imrishmika.site</a>. All rights reserved. This is Made For Prefect Board of MRCM.
        </p>
      </div>
    </footer>
  );
}