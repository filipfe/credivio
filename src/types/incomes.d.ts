type Income = {
  count: number;
  results: {
    issued_at: string;
    title: string;
    amount: string;
    description: string;
    currency: string;
    currency_date?: string;
    budget_after?: string;
  };
};
