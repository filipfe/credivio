import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function useTableQuery(viewOnly?: boolean) {
  const router = useRouter();
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState({
    page: 1,
    sort: "",
  });

  useEffect(() => {
    if (viewOnly) return;
    const params = new URLSearchParams();
    Object.keys(searchQuery).forEach((key) => {
      const value = searchQuery[key as keyof typeof searchQuery];
      value && params.set(key, String(value));
    });
    router.push(`${pathname}?${params.toString()}`);
  }, [searchQuery]);

  return {
    searchQuery,
    isLoading,
    setIsLoading,
    setSearchQuery,
  };
}
