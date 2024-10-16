export interface Payment {
  id: string;
  issued_at: string;
  title: string;
  currency: string;
  amount: number;
  type: "income" | "expense";
  user_id: string;
  recurring: boolean;
  label?: string;
}

export type Language = {
  code: string;
  name: string;
};

export type Preferences = {
  currency: string;
  language: Language;
};

export type Period = "daily" | "weekly" | "monthly";

export type Limit = {
  amount: number;
  currency: string;
  total: number;
  period: Period;
};

export type Locale = "pl" | "en" | "es";

export type Goal = {
  id: string;
  title: string;
  description?: string;
  price: number;
  currency: string;
  is_priority?: boolean;
  deadline?: string;
  payments: GoalPayment[];
};

type GoalPayment = {
  goal_id: string;
  amount: number;
  date: string;
};
