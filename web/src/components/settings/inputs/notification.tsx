"use client";

import { useSettings } from "@/lib/general/queries";
import { updateSettings } from "@/lib/settings/queries";
import toast from "@/utils/toast";
import { Button, Switch, Tooltip } from "@nextui-org/react";
import Link from "next/link";

type Props = {
  title: string;
  description: string;
  field: keyof Settings["notifications"];
};

export default function NotificationSwitch({
  title,
  description,
  field,
}: Props) {
  const { data: settings, mutate, isLoading, error } = useSettings();
  const onValueChange = async (isSelected: boolean) => {
    try {
      await mutate(updateSettings(field + "_notifications", isSelected), {
        optimisticData: (prev: any) => ({ ...prev, [field]: isSelected }),
        revalidate: false,
        populateCache: true,
        rollbackOnError: true,
      });
    } catch (e) {
      toast({
        type: "error",
        message: "Wystąpił błąd przy zmienianiu ustawienia",
      });
    }
  };

  const isDisabled =
    field === "telegram" && !isLoading && !error && !settings?.telegram_id;

  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex flex-col gap-2 mb-2">
        <h3>{title}</h3>
        <p className="text-sm text-font/60">{description}</p>
      </div>
      {isDisabled ? (
        <Tooltip
          size="sm"
          radius="md"
          content={
            <div className="flex flex-col items-center gap-2 py-2 px-2">
              <p className="text-sm">Twój bot nie jest aktywny!</p>
              <Link href="/automation">
                <Button
                  color="primary"
                  size="sm"
                  radius="md"
                  disableRipple
                  as="div"
                >
                  Aktywuj bota
                </Button>
              </Link>
            </div>
          }
        >
          <div>
            <Switch isDisabled />
          </div>
        </Tooltip>
      ) : (
        settings && (
          <Switch
            isDisabled={isLoading}
            isSelected={
              settings.notifications[
                field as keyof Settings["notifications"]
              ] as boolean
            }
            onValueChange={onValueChange}
          />
        )
      )}
    </div>
  );
}
