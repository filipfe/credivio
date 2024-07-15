import { SortDescriptor } from "@nextui-org/react";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { useDebouncedCallback } from "use-debounce";

type Options = {
  viewOnly?: boolean;
  period?: Period;
};

export default function useTableQuery<T>(rows: T[], options?: Options) {
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
      !options?.viewOnly && setIsLoading(true);
      setSearchQuery((prev) => ({
        ...prev,
        page: 1,
        label: selectedKey ? selectedKey : "",
      }));
    },
    [options?.viewOnly]
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
    !options?.viewOnly && setIsLoading(true);
    setSearchQuery((prev) => ({
      ...prev,
      page: 1,
      sort:
        (descriptor.direction === "descending" ? "-" : "") + descriptor.column,
    }));
  };

  const handlePageChange = (page: number) => {
    !options?.viewOnly && setIsLoading(true);
    setSearchQuery((prev) => ({ ...prev, page }));
  };

  const handleCurrencyChange = (currency: string) => {
    !options?.viewOnly && setIsLoading(true);
    setSearchQuery((prev) => ({ ...prev, page: 1, currency }));
  };

  useEffect(() => {
    console.log({ period: options?.period });
    if (options?.viewOnly) return;
    const params = new URLSearchParams();
    const query = { ...searchQuery, ...(options?.period || {}) };
    Object.keys(query).forEach((key) => {
      const value = query[key as keyof typeof searchQuery];
      value && params.set(key, String(value));
    });
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  }, [searchQuery, options]);

  useEffect(() => {
    if (!options?.viewOnly) return;
    const start = ((searchQuery.page || 1) - 1) * 10;
    const end = start + 10;
    return setItems(rows.slice(start, end));
  }, [rows, options?.viewOnly, searchQuery.page]);

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
