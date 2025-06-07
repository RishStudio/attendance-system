export function Footer() {
  return (
    <footer className="w-full border-t border-gray-200 bg-white bg-opacity-10 backdrop-blur-lg">
      <div className="container mx-auto px-4 py-4 flex flex-col items-center">
        <p className="text-sm text-gray-300 text-center">
          © {new Date().getFullYear()}{" "}
          <a
            href="https://rylix.imrishmika.site"
            className="text-white hover:underline"
          >
            Rylix Solution
          </a>{" "}
          &amp;{" "}
          <a
            href="https://imrishmika.site"
            className="text-white hover:underline"
          >
            ImRishmika
          </a>
          . All rights reserved. Made for the Prefect Board of MRCM.
        </p>
      </div>
    </footer>
  );
}