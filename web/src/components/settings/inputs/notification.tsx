"use client";

import {
  getNotificationsSettings,
  updateSettings,
} from "@/lib/settings/queries";
import toast from "@/utils/toast";
import { Button, Switch, Tooltip } from "@nextui-org/react";
import Link from "next/link";
import useSWR from "swr";

type Props = {
  title: string;
  description: string;
  field: string;
};

export default function NotificationSwitch({
  title,
  description,
  field,
}: Props) {
  const { data, isLoading, error, mutate } = useSWR(
    ["settings", "notifications"],
    () => getNotificationsSettings()
  );

  const onValueChange = async (isSelected: boolean) => {
    try {
      await mutate(updateSettings(field, isSelected), {
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
    field === "telegram_notifications" &&
    !isLoading &&
    !error &&
    !data?.telegram_id;

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
        data && (
          <Switch
            isDisabled={isLoading}
            isSelected={data[field as keyof Settings] as boolean}
            onValueChange={onValueChange}
          />
        )
      )}
    </div>
  );
}
