import Link from "next/link";

export default function Header() {
  return (
    <header className="px-6 bg-primary-dark py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between h-14 rounded-lg border border-white/10 bg-gradient-to-br from-[rgba(255,255,255,0.05)] to-[rgba(255,255,255,0)] px-1">
        <strong className="ml-3">Logo</strong>
        <nav className="flex items-center gap-8 h-full">
          <Link className="text-sm" href="/">
            Usługi
          </Link>
          <Link className="text-sm" href="/contact">
            Kontakt
          </Link>
        </nav>
        <div className="bg-primary/20 rounded-md p-1">
          <button className="bg-primary py-2.5 text-sm px-5 rounded-md">
            Rozpocznij
          </button>
        </div>
      </div>
    </header>
  );
}
