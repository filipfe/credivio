type OperationType = "expense" | "income";

type Operation = {
  id?: string;
  issued_at: string;
  title: string;
  amount: string;
  description: string;
  currency: string;
  currency_date?: string;
  budget_after?: string;
  type?: OperationType;
  label?: string;
};

type Label = {
  id: string;
  title: string;
  created_at: string;
  count: { count: number }[];
};
