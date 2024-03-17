import chardet from "chardet";
import Papa from "papaparse";

type Options = {
  type?: OperationType | "stock";
  skipFirstLine?: boolean;
};

export default async function parseCSV(
  file: File,
  callback: (results: string[][]) => void,
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
        callback(results);
      },
    });
  };
}
