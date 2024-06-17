interface RecurringPayment extends Payment {
  next_payment_date: string;
  last_payment_date: string;
  interval_amount: number;
  interval_unit: string;
}
