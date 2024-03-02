type Page = {
  title: string;
  href: string;
  icon: LucideIcon;
};

type SettingsPage = Page & {
  description: string;
};

type SupabaseResponse<T> = {
  error?: string;
  results: T[];
};

type Operation = {
  issued_at: string;
  title: string;
  amount: string;
  description: string;
  currency: string;
  currency_date?: string;
  budget_after?: string;
};
