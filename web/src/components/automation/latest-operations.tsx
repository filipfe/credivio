"use client";

import useClientQuery from "@/hooks/useClientQuery";
import Empty from "../ui/empty";
import { getLatestOperations } from "@/lib/automation/queries";

export default function LatestOperations() {
  const { isLoading, results } = useClientQuery({
    query: getLatestOperations("telegram"),
  });
  return (
    <div className="flex flex-col gap-4 flex-1">
      <h3 className="text-sm sm:text-base">Ostatnie operacje</h3>
      <div className="flex-1 rounded-md bg-light border border-primary/10 flex flex-col relative">
        {isLoading ? (
          <div className="flex flex-col"></div>
        ) : results.length > 0 ? (
          <div className="flex flex-col gap-4"></div>
        ) : (
          <Empty
            title="Nie dodałeś jeszcze operacji przy pomocy bota!"
            cta={{
              title: "Dodaj operacje",
              href: "https://t.me/CreDevBot",
            }}
          />
        )}
      </div>
    </div>
  );
}
