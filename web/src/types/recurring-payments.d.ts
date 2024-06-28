interface RecurringPayment extends Payment {
  next_payment_date: string;
  last_payment_date: string;
  interval_amount: number;
  interval_unit: string;
}

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
  total_amounts: TotalAmount;
};
