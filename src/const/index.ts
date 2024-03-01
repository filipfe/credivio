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
    title: "Przychód",
    href: "/income",
    icon: HandCoinsIcon,
  },
  {
    title: "Wydatki",
    href: "/expenses",
    icon: WalletIcon,
  },
  {
    title: "Aktualności",
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

export const ADD_METHODS: AddMethod[] = [
  {
    title: "Import CSV",
    type: "csv",
  },
  {
    title: "Ręcznie",
    type: "manual",
  },
];
