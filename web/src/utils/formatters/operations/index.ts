import { v4 } from "uuid";

export default function operationFormatter(data: string[][]) {
  return data.map((record) => {
    let [
      issued_at,
      currency_date,
      title,
      amount,
      currency,
      budget_after,
      description,
    ] = record;
    amount = amount.slice(1);
    budget_after = budget_after.slice(1);
    return {
      id: v4(),
      issued_at,
      currency_date,
      title,
      amount,
      currency,
      budget_after,
      description,
    };
  });
}
