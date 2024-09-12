type RecurringPayment = {
  created_at: string;
  title: string;
  amount: number;
  interval_amount: number;
  interval_unit: string;
  type: "income" | "expense";
  start_date: string;
  currency: string;
};

interface UpcomingRecurringPayment extends Payment {
  payment_date: string;
  interval_amount: number;
  interval_unit: string;
}

type Year = {
  year: number;
  months: Month[];
};

type TotalAmount = {
  [currency: string]: number;
};

type Month = {
  month: number;
  payments: Payment[];
};
