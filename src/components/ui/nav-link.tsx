"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function NavLink({ title, href, icon }: Page) {
  const pathname = usePathname();
  const Icon = icon;
  return (
    <Link
      className={`py-3 px-6 rounded-lg text-sm font-medium flex items-center gap-4 ${
        pathname === href ? "bg-light" : "hover:bg-light bg-white"
      }`}
      href={href}
      key={href}
    >
      <Icon size={16} />
      {title}
    </Link>
  );
}
