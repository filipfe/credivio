const getPaymentByDate = (date: string, payments: GoalPayment[]): number =>
  payments.find((p) => p.date === date)?.amount || 0;
