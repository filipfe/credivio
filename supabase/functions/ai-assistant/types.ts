export type Body = {
  timezone: string;
  language: string;
  input: string;
  limit?: Limit;
  transactionsFromLast30Days?: {
    transaction_date: string;
    title: string;
    type: "income" | "expense";
    amount: number;
  }[];
};
