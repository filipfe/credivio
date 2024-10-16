export type Body = {
  timezone: string;
  language: string;
  input: string;
  limit?: Limit;
  operations?: {
    issued_at: string;
    type: "income" | "expense";
    title: string;
    amount: number;
    label?: string;
  }[];
};
