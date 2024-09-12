interface Payment {
  id: string;
  issued_at: string;
  title: string;
  currency: string;
  amount: number;
  type: "income" | "expense";
  user_id: string;
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

type Settings = {
  telegram_id: string;
};
