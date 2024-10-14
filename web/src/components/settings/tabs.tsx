"use client";

import { Tab, Tabs } from "@nextui-org/react";
import {
  BellRingIcon,
  LayersIcon,
  SlidersIcon,
  UserCogIcon,
} from "lucide-react";
import TabTitle from "../ui/tab-title";
import { usePathname } from "next/navigation";
import React from "react";
import { Dict } from "@/const/dict";

export default function SettingsTabs({
  dict,
}: {
  dict: Dict["private"]["_navigation"];
}) {
  const pathname = usePathname();
  return (
    <Tabs
      radius="lg"
      variant="underlined"
      classNames={{
        tab: "h-10 max-sm:px-0 max-sm:justify-start",
        tabList: "py-0 sm:border-b max-sm:flex-col max-sm:items-start",
        panel: "flex-1 relative",
        base: "mb-4",
      }}
      selectedKey={pathname.split("/").pop()}
    >
      <Tab
        key="account"
        href="/settings/account"
        title={<TabTitle title={dict["settings/account"]} Icon={UserCogIcon} />}
      />
      <Tab
        key="preferences"
        href="/settings/preferences"
        title={
          <TabTitle title={dict["settings/preferences"]} Icon={SlidersIcon} />
        }
      />
      <Tab
        key="subscription"
        href="/settings/subscription"
        title={
          <TabTitle title={dict["settings/subscription"]} Icon={LayersIcon} />
        }
      />
      <Tab
        key="notifications"
        href="/settings/notifications"
        title={
          <TabTitle
            title={dict["settings/notifications"]}
            Icon={BellRingIcon}
          />
        }
      />
    </Tabs>
  );
}
