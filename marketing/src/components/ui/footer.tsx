import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-primary-dark">
      <div className="relative w-full mx-auto max-w-7xl">
        <div className="flex items-center gap-4 justify-between py-12">
          <Link href="/" className="text-sm text-white">
            Logo
          </Link>
        </div>
        <div className="flex items-center gap-4 justify-between py-4 border-t border-white/10">
          <small className="text-white/80">
            &copy; {new Date().getFullYear()} Monfuse, Inc. All rights reserved.
          </small>
        </div>
      </div>
    </footer>
  );
}
