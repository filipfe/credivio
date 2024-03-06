export default function getStockHoldings(transactions: StockTransaction[]) {
  const holdings: Holdings = {};

  for (const transaction of transactions) {
    const { symbol, quantity, transaction_type } = transaction;

    if (!holdings[symbol]) {
      holdings[symbol] = 0;
    }

    holdings[symbol] += transaction_type === "buy" ? quantity : -quantity;
  }

  return holdings;
}
