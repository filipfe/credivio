import { DocsLayout } from "fumadocs-ui/layout";
import type { ReactNode } from "react";
import { source } from "@/app/source";

export default function Layout({
  children,
  params,
}: {
  children: ReactNode;
  params: { lang: string };
}) {
  return (
    <DocsLayout
      tree={source.pageTree[params.lang]}
      sidebar={{ enabled: false }}
    >
      {children}
    </DocsLayout>
  );
}
