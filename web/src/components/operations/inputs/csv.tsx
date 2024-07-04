import parseCSV from "@/utils/operations/parse-csv";
import { Button } from "@nextui-org/react";
import { PaperclipIcon } from "lucide-react";
import { ChangeEvent, Dispatch, SetStateAction, useState } from "react";

type Props<T> = {
  type: OperationType;
  formatter: (data: string[][]) => T[];
  setRecords: Dispatch<SetStateAction<T[]>>;
};

export default function CSVInput<T>({ type, formatter, setRecords }: Props<T>) {
  const [fileName, setFileName] = useState("");

  const onFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.item(0);
    if (!file) return;
    setFileName(file.name);
    await parseCSV(
      file,
      (results) => setRecords((prev) => [...prev, ...formatter(results)]),
      {
        type,
      }
    );
  };

  return (
    <Button
      as="label"
      variant="light"
      className="bg-light"
      disableRipple
      fullWidth
      htmlFor="csv-file"
    >
      <PaperclipIcon className="mt-0.5" size={16} />
      {fileName || "Dodaj plik"}
      <input
        type="file"
        id="csv-file"
        required
        className="sr-only"
        accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
        onChange={onFileChange}
      />
    </Button>
  );
}
