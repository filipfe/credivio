type RecurringPayment = {
  id: string;
  next_payment_date: string;
  interval_days: number;
  title: string;
  amount: number;
  currency: string;
  type: "expense" | "income";
};
