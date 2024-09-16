import { Breakpoint } from "./types.ts";

const currencyFormat = (
  language_code: string,
  amount: number,
  currency: string,
) =>
  new Intl.NumberFormat(language_code, {
    style: "currency",
    currency,
  }).format(amount);

export const breakpoints: Breakpoint[] = [
  {
    value: 100,
    messages: {
      "pl-PL": (limit) => {
        switch (limit.period) {
          case "daily":
            return `Osięgnięto limit dzienny ${limit.currency}!
Kwota przekroczenia limitu: ${
              currencyFormat(
                "pl-PL",
                limit.total - limit.amount,
                limit.currency,
              )
            }`;
          case "weekly":
            return `Osięgnięto limit tygodniowy ${limit.currency}!
Kwota przekroczenia limitu: ${
              currencyFormat(
                "pl-PL",
                limit.total - limit.amount,
                limit.currency,
              )
            }`;
          case "monthly":
            return `Osięgnięto limit miesięczny ${limit.currency}!
Kwota przekroczenia limitu:  ${
              currencyFormat(
                "pl-PL",
                limit.total - limit.amount,
                limit.currency,
              )
            }`;
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
              currencyFormat(
                "pl-PL",
                limit.amount - limit.total,
                limit.currency,
              )
            }`;
          case "weekly":
            return `Przekroczono 75% limitu tygodniowego w walucie ${limit.currency}! Pozostało jeszcze ${
              currencyFormat(
                "pl-PL",
                limit.amount - limit.total,
                limit.currency,
              )
            }`;
          case "monthly":
            return `Przekroczono 75% limitu miesięcznego w walucie ${limit.currency}! Pozostało jeszcze ${
              currencyFormat(
                "pl-PL",
                limit.amount - limit.total,
                limit.currency,
              )
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
              currencyFormat(
                "pl-PL",
                limit.amount - limit.total,
                limit.currency,
              )
            }`;
          case "weekly":
            return `Przekroczono 50% limitu tygodniowego w walucie ${limit.currency}! Pozostało jeszcze ${
              currencyFormat(
                "pl-PL",
                limit.amount - limit.total,
                limit.currency,
              )
            }`;
          case "monthly":
            return `Przekroczono 50% limitu miesięcznego w walucie ${limit.currency}! Pozostało jeszcze ${
              currencyFormat(
                "pl-PL",
                limit.amount - limit.total,
                limit.currency,
              )
            }`;
        }
      },
    },
  },
];
