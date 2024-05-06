import Link from "next/link";

export default function Header() {
  return (
    <header className="px-6 lg:px-[16vw] bg-primary-dark py-4">
      <div className="flex items-center justify-between h-14 rounded-lg border border-white/10 bg-gradient-to-br from-[rgba(255,255,255,0.05)] to-[rgba(255,255,255,0)] px-2">
        <strong>Logo</strong>
        <div className="flex items-center gap-6">
          <nav className="flex items-center gap-4 h-full">
            <Link className="text-sm" href="/">
              Home
            </Link>
            <Link className="text-sm" href="/services">
              Services
            </Link>
            <Link className="text-sm" href="/contact">
              Contact
            </Link>
          </nav>
          <button className="flex-1 bg-primary rounded-md py-2.5 text-sm px-5 max-w-max">
            Get started
          </button>
        </div>
      </div>
    </header>
  );
}
