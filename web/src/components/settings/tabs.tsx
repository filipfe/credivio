"use client";

import { Tab, Tabs } from "@nextui-org/react";
import Account from "./account";
import {
  BellRingIcon,
  LayersIcon,
  SlidersIcon,
  UserCogIcon,
} from "lucide-react";
import Preferences from "./preferences";
import TabTitle from "../ui/tab-title";
import Subscription from "./subscription";
import Notifications from "./notifications";

export default function SettingsTabs() {
  return (
    <Tabs
      radius="lg"
      variant="underlined"
      classNames={{
        tab: "h-10",
        tabList: "py-0 border-b",
        panel: "flex-1 relative",
      }}
      defaultSelectedKey="account"
    >
      <Tab key="account" title={<TabTitle title="Konto" Icon={UserCogIcon} />}>
        <Account />
      </Tab>
      <Tab
        key="preferences"
        title={<TabTitle title="Preferencje" Icon={SlidersIcon} />}
      >
        <Preferences />
      </Tab>
      <Tab
        key="subscription"
        title={<TabTitle title="Subskrypcje i usługi" Icon={LayersIcon} />}
      >
        <Subscription />
      </Tab>
      <Tab
        key="notifications"
        title={<TabTitle title="Powiadomienia" Icon={BellRingIcon} />}
      >
        <Notifications />
      </Tab>
    </Tabs>
  );
}
