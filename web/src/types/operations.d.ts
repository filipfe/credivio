type OperationType = "expense" | "income" | "goal" | "stock";

interface Payment {
  id: string;
  issued_at: string;
  title: string;
  currency: string;
  amount: number;
  type: OperationType;
  from_telegram?: boolean;
}

interface Operation extends Payment {
  label?: string | null;
  doc_path: string | null;
  amount: string;
  type?: OperationType;
  description?: string;
}

type Limit = {
  amount: number;
  currency: string;
  period: "daily" | "weekly" | "monthly";
};

type Label = {
  name: string;
  count: number;
};

type ChartLabel = {
  name?: string;
  date?: string;
  total_amount: number;
  currency?: string;
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

type OperationsStats = {
  last_month: Stat;
  last_day: Stat;
};

type Budget = {
  currency: "PLN" | "USD" | "EUR" | "GBP" | "CHF";
  budget: number;
  difference: number;
  difference_indicator: "positive" | "negative" | "no_change";
};
