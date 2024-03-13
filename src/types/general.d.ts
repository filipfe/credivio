type Page = {
  title: string;
  href: string;
  icon: LucideIcon;
  links?: Page[];
};

type SettingsPage = Page & {
  description: string;
};

type SupabaseResponse<T> = {
  error?: string;
  results: T[];
  count?: number | null;
};

type OperationType = "expense" | "income";

type Operation = {
  id?: string;
  issued_at: string;
  title: string;
  amount: string;
  description: string;
  currency: string;
  currency_date?: string;
  budget_after?: string;
  type?: OperationType;
  label?: string;
};

type Option<T> = { name: string; value: T };

type OperationSearchParams = {
  sort?: string;
  page?: string;
};

type Currency = {
  _symbol: string;
  _ask_price: number;
  _open_bid_price: number;
  _high_bid_price: number;
  _low_bid_price: number;
  _bid_price: number;
  _bid_day_change: number;
  _bid_day_change_pcnt: string;
  _q_tm: string;
  _q_tm_lc: string;
};

type Group = {
  name: string;
  value: number;
  label: string;
  color: string;
  children: React.ReactNode;
};
