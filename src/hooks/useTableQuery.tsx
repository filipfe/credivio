import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function useTableQuery(operations: any[], viewOnly?: boolean) {
  const router = useRouter();
  const pathname = usePathname();
  const [items, setItems] = useState<Operation[]>([]);
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
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  }, [searchQuery]);

  useEffect(() => {
    if (!viewOnly) return;
    const start = ((searchQuery.page || 1) - 1) * 10;
    const end = start + 10;
    return setItems(operations.slice(start, end));
  }, [operations, viewOnly, searchQuery.page]);

  return {
    items,
    searchQuery,
    isLoading,
    setIsLoading,
    setSearchQuery,
  };
}
