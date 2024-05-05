export default function getStockHoldings(transactions: StockTransaction[]): {
  [key: string]: number;
} {
  const holdings: Holdings = {};

  for (const transaction of transactions) {
    const { symbol, quantity, transaction_type } = transaction;

    if (!holdings[symbol]) {
      holdings[symbol] = 0;
    }

    holdings[symbol] +=
      transaction_type === "buy" ? parseInt(quantity) : -parseInt(quantity);
  }

  const positiveHoldings: Holdings = {};
  for (const symbol in holdings) {
    if (holdings.hasOwnProperty(symbol) && holdings[symbol] > 0) {
      positiveHoldings[symbol] = holdings[symbol];
    }
  }

  return positiveHoldings;
}
