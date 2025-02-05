export function Footer() {
  return (
    <footer className="w-full border-t bg-black">
      <div className="container mx-auto px-4 py-4 flex flex-col items-center">
        <p className="text-sm text-gray-400 text-center">
          © {new Date().getFullYear()} <a href="https://imrishmika.site" className="text-blue-400 hover:underline">Rishmika Sandanu</a>. All rights reserved. This is Made For Prefect Board of MRCM.
        </p>
      </div>
    </footer>
  );
}