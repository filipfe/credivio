export default function groupPayments(payments: Payment[], additive: any = {}) {
  return payments.reduce(
    (prev, curr) => {
      const { type, ...rest } = curr;
      return {
        ...prev,
        [`${type}s`]: [...prev[`${type}s`], {
          ...rest,
          ...additive,
        }],
      };
    },
    { incomes: [] as Payment[], expenses: [] as Payment[] },
  );
}
