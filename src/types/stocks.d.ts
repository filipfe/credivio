type Stock = {
  _symbol: string;
  _symbol_short: string;
  _group: string;
  _isin: string;
  _quote: string;
  _quote_date: string;
  _quote_time: string;
  _time: string;
  _phase: string;
  _quote_max: number;
  _quote_min: number;
  _quote_open: number;
  _quote_ref: number;
  _quote_imp: number;
  _bid_size: number;
  _bid_volume: number;
  _bid_orders_nr: number;
  _ask_size: number;
  _ask_volume: number;
  _ask_orders_nr: number;
  _volume: number;
  _open_positions: number | null;
  _quote_volume: number;
  _transactions_nr: number;
  _turnover_value: number;
  _step: number;
  _type_of_instrument: number;
  _settlement_price: number | null;
  _change_proc: number;
  _change_pnts: number;
  _30d_change_max: number;
  _30d_change_min: number;
  _change_type: string;
  _quote_type: string;
  _debut: number;
  _live: number;
  _sw_symbol_short: number;
  _is_indice: number;
  _has_transactions: number;
  _change: number;
  _change_suffix: string;
  _change_max_min: string;
  _change_close_open: number;
  _change_settl_ref: number | null;
};

type StockTransaction = {
  id: string;
  symbol: string;
  transaction_type: "sell" | "buy";
  price: string;
  commission: string;
  commission_type?: "percentage" | "value";
  value: number;
  issued_at: string;
  quantity: string;
  currency: string;
};

type Dividend = {
  company: string;
  date: string;
  payment_date: string;
  amount: string;
  currency: string;
  ratio: number;
  for_year: string;
};

type Holdings = {
  [key: string]: number;
};

type GPWIndex = "wig20" | "mwig40" | "swig80";

type StocksIndex = {
  name: GPWIndex;
  title: string;
};
