type OperationType = "expense" | "income" | "goal" | "stock";

type Operation = {
  id: string;
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

type Label = {
  name: string;
  count: number;
};

type ChartLabel = {
  name: string;
  total_amount: number;
};

type DailyAmount = {
  date: string;
  total_amount: number;
};

type Stat = {
  amount: number;
  difference: number | null;
  is_positive: boolean;
};

type DashboardStats = {
  incomes: Stat;
  expenses: Stat;
  budget: Stat;
};

type OperationsStats = {
  last_30_days: Stat;
  last_day: Stat;
};

type LatestOperation = {
  id: string;
  title: string;
  amount: number;
  currency: string;
  type: string;
  issued_at: string;
};

type Budget = {
  currency: "PLN" | "USD" | "EUR" | "GBP" | "CHF";
  budget: number;
  difference: number;
  difference_indicator: "positive" | "negative" | "no_change";
};
