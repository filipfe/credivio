import { v4 } from "uuid";

export default function stocksFormatter(data: string[][]): StockTransaction[] {
  return data
    .map((record) => {
      let [
        issued_at,
        symbol,
        ,
        currency,
        transaction_type,
        quantity,
        price,
        ,
        value,
        ,
        commission,
      ] = record;
      price = price.replace(",", ".");
      commission = commission.replace(",", ".");
      value = value.replace(",", ".");
      const result = {
        id: v4(),
        issued_at,
        symbol,
        transaction_type:
          transaction_type === "Kupno" ? "buy" : ("sell" as "buy" | "sell"),
        quantity,
        value: parseFloat(value),
        price,
        commission,
        currency,
      };
      return result;
    })
    .filter((item) => item.symbol);
}
