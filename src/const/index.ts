import {
  AlignHorizontalDistributeCenterIcon,
  ArrowRightLeftIcon,
  BarChart4Icon,
  CoinsIcon,
  LayoutDashboardIcon,
  NewspaperIcon,
  PieChartIcon,
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
    href: "/incomes",
    icon: Wallet2Icon,
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
    icon: CoinsIcon,
    links: [
      {
        title: "Dodaj",
        icon: PlusIcon,
        href: "/expenses/add",
      },
    ],
  },
  {
    title: "Akcje",
    href: "/stocks",
    icon: AlignHorizontalDistributeCenterIcon,
    links: [
      {
        title: "Notowania",
        icon: BarChart4Icon,
        href: "/stocks",
      },
      {
        title: "Transakcje",
        icon: ArrowRightLeftIcon,
        href: "/stocks/transactions",
      },
      {
        title: "Dywidendy",
        icon: PieChartIcon,
        href: "/stocks/dividends",
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
