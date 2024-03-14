import {
  AlignHorizontalDistributeCenterIcon,
  ArrowRightLeftIcon,
  BarChart4Icon,
  Building2Icon,
  CheckCircleIcon,
  CoinsIcon,
  LayoutDashboardIcon,
  NewspaperIcon,
  PieChartIcon,
  PlusIcon,
  RepeatIcon,
  ScrollTextIcon,
  SlidersIcon,
  TrendingUpIcon,
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
    title: "Operacje",
    href: "/operations",
    icon: RepeatIcon,
    links: [
      {
        title: "Przychód",
        href: "/incomes",
        icon: Wallet2Icon,
        links: [
          {
            title: "Dodaj",
            icon: PlusIcon,
            href: "/incomes/add",
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
        title: "Cele",
        href: "/goals",
        icon: CheckCircleIcon,
        links: [
          {
            title: "Dodaj",
            icon: PlusIcon,
            href: "/goals/add",
          },
        ],
      },
    ],
  },
  {
    title: "Inwestycje",
    href: "/investments",
    icon: TrendingUpIcon,
    links: [
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
        title: "Obligacje",
        href: "/bonds",
        icon: ScrollTextIcon,
      },
      {
        title: "Nieruchomości",
        href: "/immovables",
        icon: Building2Icon,
      },
    ],
  },
  // {
  //   title: "Obligacje",
  //   href: "/bonds",
  //   icon: ScrollTextIcon,
  //   links: [
  //     {
  //       title: "Notowania",
  //       icon: BarChart4Icon,
  //       href: "/stocks",
  //     },
  //     {
  //       title: "Transakcje",
  //       icon: ArrowRightLeftIcon,
  //       href: "/stocks/transactions",
  //     },
  //   ],
  // },
  {
    title: "Aktualności",
    href: "/news",
    icon: NewspaperIcon,
  },
];

export const LINKS = PAGES.flatMap((page) => page.links || [page]);

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

export const TRANSACTION_TYPES: Option<string>[] = [
  {
    name: "Sprzedaż",
    value: "sell",
  },
  {
    name: "Kupno",
    value: "buy",
  },
];

export const COLORS = [
  "#177981", // Primary color
  "#ffc000", // Secondary color
  "#3f51b5", // Light blue
  "#ff9800", // Light orange
  "#c02942", // Red
  "#9e9e9e", // Gray
  "#28a745", // Green
  "#ffc107", // Yellow
];
