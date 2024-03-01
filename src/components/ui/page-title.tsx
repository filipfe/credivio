"use client";

import { PAGES } from "@/const";
import { usePathname } from "next/navigation";

export default function PageTitle() {
  const pathname = usePathname();
  const title = PAGES.find((item) => item.href === pathname)?.title;
  if (!title) return <></>;
  return <h1 className="text-3xl">{title}</h1>;
}
