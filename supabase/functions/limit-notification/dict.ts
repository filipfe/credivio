import { Breakpoint } from "./types.ts";

const currencyFormat = (amount: number, currency: string) =>
  new Intl.NumberFormat("pl-PL", {
    style: "currency",
    currency: currency,
  }).format(amount);

export const breakpoints: Breakpoint[] = [
  {
    value: 100,
    messages: {
      "pl-PL": (limit) => {
        switch (limit.period) {
          case "daily":
            return `Przekroczono limit dzienny w kwocie ${
              currencyFormat(limit.amount, limit.currency)
            } o ${currencyFormat(limit.total - limit.amount, limit.currency)}`;
          case "weekly":
            return `Przekroczono limit tygodniowy w kwocie ${
              currencyFormat(limit.amount, limit.currency)
            } o ${currencyFormat(limit.total - limit.amount, limit.currency)}`;
          case "monthly":
            return `Przekroczono limit miesięczny w kwocie ${
              currencyFormat(limit.amount, limit.currency)
            } o ${currencyFormat(limit.total - limit.amount, limit.currency)}`;
        }
      },
    },
  },
  {
    value: 75,
    messages: {
      "pl-PL": (limit) => {
        switch (limit.period) {
          case "daily":
            return `Przekroczono 75% limitu dziennego w walucie ${limit.currency}! Pozostało jeszcze ${
              currencyFormat(limit.amount - limit.total, limit.currency)
            }`;
          case "weekly":
            return `Przekroczono 75% limitu tygodniowego w walucie ${limit.currency}! Pozostało jeszcze ${
              currencyFormat(limit.amount - limit.total, limit.currency)
            }`;
          case "monthly":
            return `Przekroczono 75% limitu miesięcznego w walucie ${limit.currency}! Pozostało jeszcze ${
              currencyFormat(limit.amount - limit.total, limit.currency)
            }`;
        }
      },
    },
  },
  {
    value: 50,
    messages: {
      "pl-PL": (limit) => {
        switch (limit.period) {
          case "daily":
            return `Przekroczono 50% limitu dziennego w walucie ${limit.currency}! Pozostało jeszcze ${
              currencyFormat(limit.amount - limit.total, limit.currency)
            }`;
          case "weekly":
            return `Przekroczono 50% limitu tygodniowego w walucie ${limit.currency}! Pozostało jeszcze ${
              currencyFormat(limit.amount - limit.total, limit.currency)
            }`;
          case "monthly":
            return `Przekroczono 50% limitu miesięcznego w walucie ${limit.currency}! Pozostało jeszcze ${
              currencyFormat(limit.amount - limit.total, limit.currency)
            }`;
        }
      },
    },
  },
];
