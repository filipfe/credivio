import { PeriodContext } from "@/app/(private)/(sidebar)/(operations)/providers";
import { Dict } from "@/const/dict";
import { getLocalTimeZone, parseDate, today } from "@internationalized/date";
import {
  Badge,
  Button,
  DateValue,
  Popover,
  PopoverContent,
  PopoverTrigger,
  RangeCalendar,
  RangeValue,
} from "@nextui-org/react";
import { CalendarDaysIcon, ListRestartIcon } from "lucide-react";
import { useContext, useRef, useState } from "react";

export default function PeriodSelect({
  dict,
}: {
  dict: {
    reset: string;
  };
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const { period, setPeriod } = useContext(PeriodContext);
  const numberOfParams = Object.values(period).filter(Boolean).length;

  const onChange = ({ start, end }: RangeValue<DateValue>) => {
    setIsOpen(false);
    setPeriod({
      from: `${start.year}-${start.month < 10 ? "0" : ""}${start.month}-${
        start.day < 10 ? "0" : ""
      }${start.day}`,
      to: `${end.year}-${end.month < 10 ? "0" : ""}${end.month}-${
        end.day < 10 ? "0" : ""
      }${end.day}`,
    });
  };

  return (
    <Popover
      ref={ref}
      isOpen={isOpen}
      onOpenChange={setIsOpen}
      placement="bottom"
      shouldCloseOnInteractOutside={(element) => !element.contains(ref.current)}
      classNames={{
        content: "p-0 border-0 shadow-none",
      }}
    >
      <PopoverTrigger>
        <div>
          <Badge
            content={numberOfParams === 2 ? 1 : 0}
            isInvisible={numberOfParams === 0}
            color="primary"
            size="lg"
          >
            <Button
              isIconOnly
              disableRipple
              className="border"
              onClick={() => setIsOpen((prev) => !prev)}
            >
              <CalendarDaysIcon size={16} />
            </Button>
          </Badge>
        </div>
      </PopoverTrigger>
      <PopoverContent>
        <RangeCalendar
          showShadow={false}
          value={
            numberOfParams === 2
              ? { start: parseDate(period.from), end: parseDate(period.to) }
              : undefined
          }
          onChange={onChange}
          classNames={{
            base: "!bg-white",
            gridHeader: "!shadow-none",
            title: "select-none",
          }}
          maxValue={today(getLocalTimeZone())}
          bottomContent={
            <div className="grid grid-cols-1 pb-2 px-2">
              <Button
                disabled={period.from === "" || period.to === ""}
                disableRipple
                size="sm"
                onClick={() => {
                  setIsOpen(false);
                  setPeriod({ from: "", to: "" });
                }}
              >
                <ListRestartIcon size={15} strokeWidth={2} /> {dict.reset}
              </Button>
            </div>
          }
        />
      </PopoverContent>
    </Popover>
  );
}
