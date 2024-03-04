import {
  CoinsIcon,
  LayoutDashboardIcon,
  NewspaperIcon,
  SlidersIcon,
  UserCogIcon,
  Wallet2Icon,
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
    icon: CoinsIcon,
  },
  {
    title: "Wydatki",
    href: "/expenses",
    icon: Wallet2Icon,
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
    title: "Ręcznie",
    type: "manual",
  },
  {
    title: "Import CSV",
    type: "csv",
  },
];

export const CURRENCIES = ["USD", "PLN", "GBP", "AUD"];
