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

export default function SettingsTabs() {
  const pathname = usePathname();
  return (
    <Tabs
      radius="lg"
      variant="underlined"
      classNames={{
        tab: "h-10",
        tabList: "py-0 border-b",
        panel: "flex-1 relative",
        base: "mb-4",
      }}
      selectedKey={pathname.split("/").pop()}
    >
      <Tab
        key="account"
        href="/settings/account"
        title={<TabTitle title="Konto" Icon={UserCogIcon} />}
      />
      <Tab
        key="preferences"
        href="/settings/preferences"
        title={<TabTitle title="Preferencje" Icon={SlidersIcon} />}
      />
      <Tab
        key="subscription"
        href="/settings/subscription"
        title={<TabTitle title="Subskrypcja" Icon={LayersIcon} />}
      />
      <Tab
        key="notifications"
        href="/settings/notifications"
        title={<TabTitle title="Powiadomienia" Icon={BellRingIcon} />}
      />
    </Tabs>
  );
}
