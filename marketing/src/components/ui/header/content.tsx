import Link from "next/link";
import Wrapper from "./wrapper";

export default function Header() {
  return (
    <header>
      <Wrapper>
        <Link href="/" className="ml-3 text-sm">
          Logo
        </Link>
        <nav className="flex items-center gap-8 h-full">
          <Link className="text-sm font-medium text-foreground" href="/">
            Usługi
          </Link>
          <Link className="text-sm font-medium text-foreground" href="/blog">
            Blog
          </Link>
          <Link className="text-sm font-medium text-foreground" href="/contact">
            Kontakt
          </Link>
        </nav>
        <div className="bg-primary/20 rounded-lg p-1 flex items-center">
          <Link
            href="https://app.monfuse.com"
            className="bg-primary py-2.5 text-sm px-5 rounded-md text-white"
          >
            Rozpocznij
          </Link>
        </div>
      </Wrapper>
    </header>
  );
}
