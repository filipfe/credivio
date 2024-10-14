interface Payment {
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

type Language = {
  code: string;
  name: string;
};

type Preferences = {
  currency: string;
  language: Language;
};

type Period = "daily" | "weekly" | "monthly";

type Limit = {
  amount: number;
  currency: string;
  total: number;
  period: Period;
};
