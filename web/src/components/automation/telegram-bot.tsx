import LatestOperations from "@/components/automation/latest-operations";
import TokenInput from "@/components/automation/token-input";
import Block from "@/components/ui/block";
import Image from "next/image";
import { ReactNode } from "react";

type Props = {
  preferences: Preferences;
  children?: ReactNode;
  isRegistered?: boolean;
};

export default function TelegramBot({ preferences, children }: Props) {
  const isRegistered = !!preferences.telegram_id;
  return (
    <Block
      className="max-w-3xl"
      title={
        <div className="flex items-center gap-4">
          <Image
            className="max-w-8"
            width={240}
            height={240}
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/82/Telegram_logo.svg/2048px-Telegram_logo.svg.png"
            alt="Telegram Logo"
          />
          <h3 className="sm:text-lg text-base">Telegram Bot</h3>
        </div>
      }
      cta={
        <div
          className={`${
            isRegistered ? "bg-success/20" : "bg-danger/20"
          } h-5 w-5 rounded-full grid place-content-center`}
        >
          <div
            className={`${
              isRegistered ? "bg-success" : "bg-danger"
            } h-3 w-3 rounded-full`}
          />
        </div>
      }
    >
      <div className="flex-1 flex flex-col gap-6">
        <div className="flex flex-col gap-6">
          <p className="text-sm">
            Dodawaj operacje szybciej za pomocą dostosowanego Telegram Bota!
          </p>
          <p className="text-sm">
            Bot automatyzuje wiele procesów, oszczędzając Twój czas i
            minimalizując ryzyko błędów. Wszystkie dane są synchronizowane w
            czasie rzeczywistym, więc masz pewność, że informacje są zawsze
            aktualne.
          </p>
          <p className="text-sm">
            Oto twój klucz Telegram. Wyślij go do bota, aby połączyć swoje
            konto:
          </p>
          <TokenInput token={preferences.telegram_token} />
        </div>
        {children}
      </div>
    </Block>
  );
}
