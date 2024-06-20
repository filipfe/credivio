"use client";

import useClientQuery from "@/hooks/useClientQuery";
import Empty from "../ui/empty";
import { getLatestOperations } from "@/lib/automation/queries";
import { useEffect, useLayoutEffect, useRef } from "react";
import { createClient } from "@/utils/supabase/client";
import OperationRef from "../operations/ref";
import { ScrollShadow } from "@nextui-org/react";
import { AnimatePresence, motion } from "framer-motion";

export default function LatestOperations() {
  const scrollAreaRef = useRef<HTMLElement | null>(null);
  const { isLoading, results, setResults } = useClientQuery({
    query: getLatestOperations("telegram"),
  });

  useEffect(() => {
    const supabase = createClient();
    supabase
      .channel("table_db_changes")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "incomes",
        },
        (payload) => {
          const operation = payload.new as Payment;
          if (!operation.from_telegram) return;
          setResults((prev) => [...prev, { ...operation, type: "income" }]);
        }
      )
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "expenses",
        },
        (payload) => {
          const operation = payload.new as Payment;
          if (!operation.from_telegram) return;
          setResults((prev) => [...prev, { ...operation, type: "expense" }]);
        }
      )
      .subscribe();
  }, []);

  useLayoutEffect(() => {
    if (!scrollAreaRef.current) return;
    scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
  }, [results]);

  return (
    <div className="flex flex-col gap-4 flex-1">
      <h3 className="text-sm sm:text-base">Ostatnie operacje</h3>
      <div className="flex-1 rounded-md bg-light border border-primary/10 flex flex-col relative min-h-48">
        <ScrollShadow
          ref={scrollAreaRef}
          hideScrollBar
          className="flex-1 max-h-[calc(100vh-580px)] p-6 flex flex-col"
        >
          {isLoading ? (
            <div className="flex flex-col"></div>
          ) : results.length > 0 ? (
            <div className="flex flex-col gap-4">
              <AnimatePresence>
                {results.map((operation, k) => (
                  <motion.div
                    layout
                    initial={{ opacity: 0, scale: 1, y: 50, x: 0 }}
                    animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
                    exit={{ opacity: 0, scale: 1, y: 1, x: 0 }}
                    transition={{
                      opacity: { duration: 0.1 },
                      layout: {
                        type: "spring",
                        bounce: 0.3,
                        duration: k * 0.05 + 0.2,
                      },
                    }}
                    style={{
                      originX: 0.5,
                      originY: 0.5,
                    }}
                    className={
                      operation.type === "expense" ? "self-end" : "self-start"
                    }
                    key={`wrapper-${operation.id}`}
                  >
                    <OperationRef payment={operation} key={operation.id} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          ) : (
            <Empty
              title="Nie dodałeś jeszcze operacji przy pomocy bota!"
              cta={{
                title: "Dodaj operacje",
                href: "https://t.me/CreDevBot",
              }}
            />
          )}
        </ScrollShadow>
      </div>
    </div>
  );
}
