import { SortDescriptor } from "@nextui-org/react";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { useDebouncedCallback } from "use-debounce";

export default function useTableQuery<T>(rows: T[], viewOnly?: boolean) {
  const router = useRouter();
  const pathname = usePathname();
  const [items, setItems] = useState<T[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState({
    page: 1,
    sort: "",
    search: "",
    label: "",
    currency: "",
  });

  const handleLabelChange = useCallback(
    (selectedKey?: string) => {
      !viewOnly && setIsLoading(true);
      setSearchQuery((prev) => ({
        ...prev,
        page: 1,
        label: selectedKey ? selectedKey : "",
      }));
    },
    [viewOnly]
  );

  const handleSearch = useDebouncedCallback((value: string) => {
    setIsLoading(true);
    setSearchQuery((prev) => ({
      ...prev,
      page: 1,
      search: value,
    }));
  }, 300);

  const handleSort = (descriptor: SortDescriptor) => {
    setIsLoading(true);
    setSearchQuery((prev) => ({
      ...prev,
      page: 1,
      sort:
        (descriptor.direction === "descending" ? "-" : "") + descriptor.column,
    }));
  };

  const handlePageChange = (page: number) => {
    setIsLoading(true);
    setSearchQuery((prev) => ({ ...prev, page }));
  };

  const handleCurrencyChange = (currency: string) => {
    setIsLoading(true);
    setSearchQuery((prev) => ({ ...prev, page: 1, currency }));
  };

  useEffect(() => {
    if (viewOnly) return;
    const params = new URLSearchParams();
    Object.keys(searchQuery).forEach((key) => {
      const value = searchQuery[key as keyof typeof searchQuery];
      value && params.set(key, String(value));
    });
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  }, [searchQuery]);

  return {
    items,
    setItems,
    searchQuery,
    isLoading,
    setIsLoading,
    setSearchQuery,
    handleSearch,
    handleSort,
    handlePageChange,
    handleLabelChange,
    handleCurrencyChange,
  };
}
