interface RecurringPayment extends Payment {
  next_payment_date: string;
  interval_days: number;
}
