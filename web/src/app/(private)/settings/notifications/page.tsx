import HourInput from "@/components/settings/inputs/hour";
import NotificationSwitch from "@/components/settings/inputs/notification";

export default function Page() {
  return (
    <div className="flex flex-col gap-8">
      <HourInput />
      <div className="flex flex-col gap-8 lg:gap-0 lg:grid grid-cols-2 2xl:grid-cols-3">
        <div className="lg:pr-8">
          <NotificationSwitch
            title="Powiadomienia Telegram"
            description="Wysyłane automatycznie przez Telegram Bota"
            field="telegram_notifications"
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
