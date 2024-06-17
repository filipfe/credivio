type OperationType = "expense" | "income" | "goal" | "stock";

interface Payment {
  id: string;
  issued_at: string;
  title: string;
  currency: string;
  amount: number;
  type: OperationType;
}

interface Operation extends Payment {
  amount: string;
  description: string;
  currency_date?: string;
  budget_after?: string;
  type?: OperationType;
  label?: string;
}

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
  difference: number;
  difference_indicator: "positive" | "negative" | "no_change";
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

type Budget = {
  currency: "PLN" | "USD" | "EUR" | "GBP" | "CHF";
  budget: number;
  difference: number;
  difference_indicator: "positive" | "negative" | "no_change";
};
