import { getNotificationsSettings } from "@/lib/settings/queries";
import useSWR from "swr";
import HourInput from "./inputs/hour";
import NotificationSwitch from "./inputs/notification";

export default function Notifications() {
  const { data, error, isLoading } = useSWR(
    ["settings", "notifications"],
    getNotificationsSettings
  );

  if (isLoading) {
    return (
      <div className="w-full h-full grid place-content-center">
        <l-hatch size={36} stroke={5} />
      </div>
    );
  }

  if (!data || error) {
    return (
      <div className="w-full h-full flex flex-col gap-4 justify-center items-center">
        <p className="text-sm">Wystąpił błąd przy pobieraniu danych!</p>
        {/* <Button
            size="sm"
            color="primary"
            radius="md"
            disableRipple
            startContent={<RefreshCcwIcon size={14} />}
          >
            Spróbuj ponownie
          </Button> */}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <HourInput />
      <div className="flex flex-col gap-8 lg:gap-0 lg:grid grid-cols-2 2xl:grid-cols-3">
        <div className="lg:pr-8">
          <NotificationSwitch
            title="Powiadomienia Telegram"
            description="Wysyłane automatycznie przez Telegram Bota"
            field="telegram_notifications"
            isDisabled={!data?.telegram_id}
          />
        </div>
        <div className="lg:pl-8 border-l">
          <NotificationSwitch
            title="Powiadomienia Email"
            description="Wysyłane automatycznie na adres email"
            field="email_notifications"
          />
        </div>
      </div>
    </div>
  );
}
