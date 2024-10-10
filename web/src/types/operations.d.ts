type OperationType = "expense" | "income" | "goal" | "stock";

interface Payment {
  id: string;
  issued_at: string;
  title: string;
  currency: string;
  amount: number;
  type: OperationType;
  from_telegram?: boolean;
  label?: string | null;
}

interface Operation extends Payment {
  doc_path: string | null;
  amount: string;
  type?: OperationType;
  description?: string;
}

type Limit = {
  amount: number;
  currency: string;
  period: "daily" | "weekly" | "monthly";
  total: number;
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

interface NewLimit {
  amount: string;
  period: string;
  currency: string;
}
