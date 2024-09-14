type Period = "daily" | "weekly" | "monthly";

export type Limit = {
  amount: number;
  currency: string;
  total: number;
  period: Period;
};

export type Breakpoint = {
  value: number;
  messages: {
    [language_code: string]: (limit: Limit) => string;
  };
};
