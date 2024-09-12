export default function parsePastRecurringPayments(
  payments: Payment[],
): Year[] {
  return payments.reduce((acc: Year[], current) => {
    const date = new Date(current.issued_at);
    const year = date.getUTCFullYear();
    const month = date.getUTCMonth() + 1;

    // Find the year group
    let yearGroup = acc.find((group) => group.year === year);

    if (!yearGroup) {
      yearGroup = { year, months: [] };
      acc.push(yearGroup);
    }

    // Find the month group within the year group
    let monthGroup = yearGroup.months.find((m) => m.month === month);

    if (!monthGroup) {
      monthGroup = { month, payments: [] };
      yearGroup.months.push(monthGroup);
    }

    // Add the current payment to the month
    monthGroup.payments.push(current);

    return acc;
  }, []);
}
