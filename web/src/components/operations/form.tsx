"use client";

import { Button, Spinner, Tab, Tabs } from "@nextui-org/react";
import {
  CheckIcon,
  FileSpreadsheetIcon,
  PlusIcon,
  ScanTextIcon,
  WrenchIcon,
} from "lucide-react";
import { FormEvent, Fragment, useState, useTransition } from "react";
import { addOperations } from "@/lib/operations/actions";
import { v4 } from "uuid";
import Block from "../ui/block";
import Scan from "./inputs/scan";
import CSVInput from "./inputs/csv";
import operationFormatter from "@/utils/formatters/operations";
import Manual from "./inputs/manual";
import LabelInput from "./inputs/label";
import PreviewTable from "../ui/preview-table";
import toast from "react-hot-toast";
import Toast from "../ui/toast";
import { format } from "date-fns";

export default function AddForm({
  type,
  defaultCurrency,
}: {
  type: OperationType;
  defaultCurrency: string;
}) {
  const [isPending, startTransition] = useTransition();
  const [records, setRecords] = useState<Operation[]>([]);
  const [label, setLabel] = useState<string | null>(null);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const issuedAt = formData.get("issued_at")?.toString() || "";
    const currentDate = format(new Date(), "yyyy-MM-dd");

    const operation: Operation = {
      id: v4(),
      title: formData.get("title")?.toString() || "",
      amount: formData.get("amount")?.toString() || "",
      issued_at: issuedAt === currentDate ? new Date().toISOString() : issuedAt,
      currency: formData.get("currency")?.toString() || "",
      doc_path: null,
    };

    setRecords((prev) => [...prev, operation]);
  };

  const onSave = (formData: FormData) =>
    startTransition(async () => {
      const { error } = await addOperations(formData);
      if (error) {
        toast.custom((t) => <Toast {...t} type="error" message={error} />);
      } else {
        toast.custom((t) => (
          <Toast {...t} type="success" message="Pomyślnie dodano operację!" />
        ));
      }
    });

  return (
    <div className="flex flex-col xl:grid grid-cols-2 gap-4 sm:gap-8">
      <Block title="Dane">
        <Tabs radius="lg" classNames={{ panel: "p-0" }}>
          <Tab
            key="manual"
            title={
              <div className="flex items-center gap-2">
                <WrenchIcon size={16} opacity={0.8} />
                <span>Ręcznie</span>
              </div>
            }
          >
            <Manual
              type={type}
              defaultCurrency={defaultCurrency}
              id="add-form"
              onSubmit={onSubmit}
            />
            <div className="flex justify-end mt-6">
              <Button
                type="submit"
                color="secondary"
                form="add-form"
                className="text-white h-9"
                disableRipple
              >
                <PlusIcon size={16} />
                Dodaj
              </Button>
            </div>
          </Tab>
          <Tab
            key="csv"
            title={
              <div className="flex items-center gap-2">
                <FileSpreadsheetIcon size={16} opacity={0.8} />
                <span>Import CSV</span>
              </div>
            }
          >
            <CSVInput
              type={type}
              setRecords={setRecords}
              formatter={operationFormatter}
            />
          </Tab>
          <Tab
            key="scan"
            title={
              <div className="flex items-center gap-2">
                <ScanTextIcon size={16} opacity={0.8} />
                <span>Skan dokumentu</span>
              </div>
            }
          >
            <Scan setRecords={setRecords} />
          </Tab>
        </Tabs>
      </Block>
      <PreviewTable type={type} rows={records} count={records.length}>
        <form className="flex-1 relative" action={onSave}>
          <div className="flex flex-col gap-8 justify-end h-full">
            {type === "expense" && (
              <LabelInput isDisabled={records.length === 0} />
            )}
            <Button
              isDisabled={isPending || records.length === 0}
              color="primary"
              type="submit"
              className="h-9 w-24 text-white self-end"
            >
              {isPending ? (
                <Spinner color="white" size="sm" />
              ) : (
                <Fragment>
                  <CheckIcon className="mt-0.5" size={16} /> Zapisz
                </Fragment>
              )}
            </Button>
            <input type="hidden" name="type" value={type} />
            <input type="hidden" name="data" value={JSON.stringify(records)} />
          </div>
        </form>
      </PreviewTable>
    </div>
  );
}
