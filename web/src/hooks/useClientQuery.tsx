"use client";

import {
  DependencyList,
  Dispatch,
  SetStateAction,
  useEffect,
  useState,
} from "react";

type Props<T> = {
  query: Promise<SupabaseResponse<T>>;
  deps?: DependencyList;
};

type ReturnType<T> = {
  isLoading: boolean;
  results: T[];
  setResults: Dispatch<SetStateAction<T[]>>;
};

export default function useClientQuery<T>({
  deps = [],
  query,
}: Props<T>): ReturnType<T> {
  const [results, setResults] = useState<T[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    (async () => {
      const { results: _results } = await query;
      setResults(_results);
      setIsLoading(false);
    })();
  }, deps);

  return {
    isLoading,
    results,
    setResults,
  };
}
