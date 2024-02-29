import { PAGES } from "@/const";
import Link from "next/link";

export default function Sidebar() {
  return (
    <aside className="sticky top-20 max-h-[calc(100vh-80px)]">
      <nav className="flex flex-col px-4">
        {PAGES.map(({ title, href }) => (
          <Link
            className="py-2 px-4 rounded font-medium text-sm"
            href={href}
            key={href}
          >
            {title}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
