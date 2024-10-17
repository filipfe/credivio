import { Goal } from "../_shared/types.ts";
import { Limit } from "../_shared/types.ts";

export type Body = {
  input: string;
  currency: string;
  limit?: Limit;
  goal?: Goal;
  operations?: Partial<Record<OperationsType, boolean>>;
};

export type OperationsType = "incomes" | "expenses" | "recurring_payments";
