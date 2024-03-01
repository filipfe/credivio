import {
  HandCoinsIcon,
  LayoutDashboardIcon,
  NewspaperIcon,
  SlidersIcon,
  UserCogIcon,
  WalletIcon,
} from "lucide-react";

export const PAGES: Page[] = [
  {
    title: "Dashboard",
    href: "/",
    icon: LayoutDashboardIcon,
  },
  {
    title: "Income",
    href: "/income",
    icon: HandCoinsIcon,
  },
  {
    title: "Expenses",
    href: "/expenses",
    icon: WalletIcon,
  },
  {
    title: "News",
    href: "/news",
    icon: NewspaperIcon,
  },
];

export const SETTINGS_PAGES: (Page & { description: string })[] = [
  {
    title: "Preferencje",
    href: "/preferences",
    icon: SlidersIcon,
    description:
      "Kliknij tutaj, aby zarządzać ustawieniami wyświetlania, powiadomień i innymi.",
  },
  {
    title: "Konto",
    href: "/account",
    icon: UserCogIcon,
    description:
      "Kliknij tutaj, aby zarządzać ustawieniami wyświetlania, powiadomień i innymi.",
  },
];
