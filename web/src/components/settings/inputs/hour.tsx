import { updateSettings } from "@/lib/settings/queries";
import { Time } from "@internationalized/date";
import { TimeInput, TimeInputValue } from "@nextui-org/react";
import { ClockIcon } from "lucide-react";
import useSWR from "swr";

export default function HourInput() {
  const { data, mutate } = useSWR(["settings", "notifications"]);

  const onValueChange = async (time: TimeInputValue) => {
    const date = new Date();
    date.setHours(time.hour, 0, 0, 0);
    const value = `${date.getUTCHours()}:00:00+00`;
    try {
      await mutate(updateSettings("graph_time", value), {
        optimisticData: (prev: any) => ({ ...prev, graph_time: value }),
      });
    } catch (err) {}
  };

  console.log(data);

  const defaultDate = new Date();
  defaultDate.setUTCHours(parseInt(data.graph_time.split(":")[0]), 0, 0, 0);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <h3>Wykresy podsumowywujące</h3>
        <p className="text-sm text-font/60">
          Powiadomienia o podsumowaniach dnia, tygodnia lub miesiąca
        </p>
      </div>
      <TimeInput
        label="Godzina"
        value={new Time(defaultDate.getHours(), 0o0)}
        onChange={onValueChange}
        startContent={<ClockIcon size={16} />}
        hourCycle={24}
        className="max-w-max"
      />
    </div>
  );
}
