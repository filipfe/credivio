import {
  CoinsIcon,
  LayoutDashboardIcon,
  NewspaperIcon,
  PlusIcon,
  SlidersIcon,
  UserCogIcon,
  Wallet2Icon,
} from "lucide-react";

export const PAGES: Page[] = [
  {
    title: "Panel",
    href: "/",
    icon: LayoutDashboardIcon,
  },
  {
    title: "Przychód",
    href: "/income",
    icon: CoinsIcon,
    links: [
      {
        title: "Dodaj",
        icon: PlusIcon,
        href: "/income/add",
      },
    ],
  },
  {
    title: "Wydatki",
    href: "/expenses",
    icon: Wallet2Icon,
    links: [
      {
        title: "Dodaj",
        icon: PlusIcon,
        href: "/expenses/add",
      },
    ],
  },
  {
    title: "Aktualności",
    href: "/news",
    icon: NewspaperIcon,
    links: [],
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
