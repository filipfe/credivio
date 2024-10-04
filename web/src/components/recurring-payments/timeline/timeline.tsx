"use client";

import Block from "@/components/ui/block";
import { ScrollShadow, Spinner } from "@nextui-org/react";
import Month from "./month";
import Empty from "@/components/ui/empty";
import { useEffect, useMemo, useRef } from "react";
import { getPastRecurringPayments } from "@/lib/recurring-payments/queries";
import useSWRInfinite from "swr/infinite";
import parsePastRecurringPayments from "@/utils/operations/parse-past-recurring-payments";
import Loader from "@/components/stocks/loader";

export default function Timeline() {
  const ref = useRef<HTMLElement | null>(null);
  // const [month, setMonth] = useState<number>();
  // const [year, setYear] = useState<number>();
  const { data, size, setSize, isLoading } = useSWRInfinite(
    (index) => ["recurring_payments", "past", index],
    ([_k1, _k2, page]) => getPastRecurringPayments({ page }),
    { revalidateFirstPage: false }
  );

  const years = useMemo(
    () =>
      data
        ? parsePastRecurringPayments(data.flatMap((records) => records))
        : [],
    [data]
  );

  const isLoadingMore =
    isLoading || (size > 0 && data && typeof data[size - 1] === "undefined");

  const isEmpty = data?.[0]?.length === 0;

  const isReachingEnd = isEmpty || (data && data[data.length - 1]?.length < 8);

  const onScroll = () => {
    if (isLoadingMore || isReachingEnd || !ref.current) return;
    const isBottom =
      ref.current.scrollHeight - ref.current.scrollTop ===
      ref.current.clientHeight;
    isBottom && setSize((prev) => prev + 1);
  };

  useEffect(() => {
    onScroll();
  }, [data]);

  if (isLoading) {
    return <Loader className="row-start-1 row-end-3 col-start-2 col-end-3" />;
  }

  return (
    <Block
      title="Przeszłe płatności"
      className="row-start-1 row-end-3 col-start-2 col-end-3"
      // cta={
      //   <div className="flex items-center gap-2 flex-1 max-w-xs">
      //     <MonthInput
      //       value={month}
      //       disabledKeys={
      //         year === now.getFullYear()
      //           ? getDisabledMonths(now.getMonth())
      //           : []
      //       }
      //       onChange={(value) => setMonth(value)}
      //     />
      //     <YearInput value={year} onChange={(value) => setYear(value)} />
      //   </div>
      // }
    >
      {years && years.length > 0 ? (
        <ScrollShadow
          className="h-[calc(100vh-266px)]"
          ref={ref}
          onScroll={onScroll}
          hideScrollBar
          size={0}
        >
          <div className="flex flex-col h-full">
            {years.map(({ year, months }) =>
              months.map((month) => (
                <Month {...month} year={year} key={month.month} />
              ))
            )}
            {!isReachingEnd && <Spinner color="primary" size="sm" />}
          </div>
        </ScrollShadow>
      ) : (
        <Empty
          title="Nie znaleziono historii płatności!"
          cta={{
            title: "Dodaj płatność cykliczną",
            href: "/recurring-payments/add",
          }}
        />
      )}
    </Block>
  );
}
