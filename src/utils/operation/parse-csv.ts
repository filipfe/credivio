import chardet from "chardet";
import Papa from "papaparse";

type Options = {
  type?: "expense" | "income";
  skipFirstLine?: boolean;
};

export default async function parseCSV(
  file: File,
  callback: (results: Operation[]) => void,
  options?: Options
) {
  const { type, skipFirstLine = true } = options || {};
  const encoding = chardet.detect(Buffer.from(await file.arrayBuffer()));
  const reader = new FileReader();
  reader.readAsText(file, encoding || "UTF-8");
  reader.onload = (ev) => {
    if (!ev.target?.result) return;
    Papa.parse(ev.target.result as string, {
      skipEmptyLines: true,
      encoding: "UTF-8",
      complete: ({ data, errors }) => {
        if (errors.length > 0) return;
        let results = data as string[][];
        if (skipFirstLine) {
          results = results.slice(1);
        }
        if (type) {
          results = results.filter(
            (item) => item[3][0] !== (type === "expense" ? "+" : "-")
          );
        }
        callback(
          results.map((record) => {
            let [
              issued_at,
              currency_date,
              title,
              amount,
              currency,
              budget_after,
              description,
            ] = record;
            amount = amount.slice(1);
            budget_after = budget_after.slice(1);
            return {
              issued_at,
              currency_date,
              title,
              amount,
              currency,
              budget_after,
              description,
            };
          })
        );
      },
    });
  };
}
