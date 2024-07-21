type Page = {
  title: string;
  href: string;
  icon: LucideIcon;
  description?: string;
  links?: Page[];
};

type SettingsPage = Page & {
  description: string;
};

type SupabaseResponse<T = void> = {
  error?: string;
  results: T[];
  count?: number | null;
};

type SupabaseSingleRowResponse<T> = {
  error?: string;
  result: T | null;
};

type Option<T> = { name: string; value: T };

type SearchParams = {
  sort?: string;
  page?: string;
  search?: string;
  label?: string; //expense
  currency?: string;
  from?: string;
  to?: string;
  month?: number;
  year?: number;
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

type State = {
  value: string;
  onChange: (value: string) => void;
};

interface FilterProps {
  enabled?: {
    label?: boolean;
    currency?: boolean;
    transaction?: boolean;
  };
  state: {
    label?: State;
    currency?: State;
    transaction?: State;
  };
}

type ActionButtonProps = {
  text: string;
  icon: LucideIcon;
  onSubmit: () => Promise<void>;
};

type Period = {
  from: string;
  to: string;
};
