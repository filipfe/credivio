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

type Option = { name: string; value: number };

type OperationSearchParams = {
  sort?: string;
  page?: string;
};
