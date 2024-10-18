import LatestOperations from "@/components/automation/latest-operations";
import TokenInput from "@/components/automation/token-input";
import Block from "@/components/ui/block";
import { Dict } from "@/const/dict";
import { Button, cn } from "@nextui-org/react";
import { LinkIcon, Send } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { ReactNode } from "react";

type Props = {
  dict: Dict["private"]["automation"];
  settings: Settings;
  children?: ReactNode;
  isRegistered?: boolean;
  simplified?: boolean;
};

export default function TelegramBot({
  settings,
  children,
  simplified,
  dict,
}: Props) {
  const isRegistered = !!settings.telegram_id;
  return (
    <Block
      className={cn("max-w-3xl", simplified && "border-none !p-4")}
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
          <Link
            className="bg-light border grid place-content-center h-7 w-7 rounded-md"
            href="https://t.me/MonfuseBot"
            target="_blank"
            rel="noreferrer"
          >
            <LinkIcon size={14} />
          </Link>
        </div>
      }
      cta={
        !simplified && (
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
        )
      }
    >
      <div className="flex-1 flex flex-col gap-6">
        <div className="flex flex-col gap-6">
          {dict.description.map((text) => (
            <p className="text-sm">{text}</p>
          ))}
          <div className="flex items-center gap-3 max-w-lg">
            <TokenInput token={settings.telegram_token} dict={dict.input} />
            <Button className="font-medium" color="primary" as="div">
              <Send size={16} />
              Wyślij
            </Button>
          </div>
        </div>
        {children}
      </div>
    </Block>
  );
}
