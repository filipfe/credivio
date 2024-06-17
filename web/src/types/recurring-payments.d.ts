interface RecurringPayment extends Payment {
  next_payment_date: string;
  last_payment_date: string;
  interval_amount: number;
  interval_unit: string;
}

type Year = {
  year: number;
  months: Month[];
};

type TotalAmount = {
  currency: string;
  total_amount: number;
};

type Month = {
  month: number;
  payments: Payment[];
  total_amounts: TotalAmount[];
};
