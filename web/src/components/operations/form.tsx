"use client";

import {
  Autocomplete,
  AutocompleteItem,
  Button,
  Spinner,
  Tab,
  Tabs,
  Tooltip,
} from "@nextui-org/react";
import {
  CheckIcon,
  FileSpreadsheetIcon,
  HelpCircleIcon,
  ScanTextIcon,
  WrenchIcon,
} from "lucide-react";
import { Fragment, useEffect, useState, useTransition } from "react";
import { addOperations, getLabels } from "@/lib/operations/actions";
import OperationTable from "./table";
import { v4 } from "uuid";
import Block from "../ui/block";
import Scan from "./inputs/scan";
import CSVInput from "./inputs/csv";
import operationFormatter from "@/utils/formatters/operations";
import Manual from "./inputs/manual";
import LabelInput from "./inputs/label";

const defaultRecord: Omit<Operation, "id"> = {
  title: "",
  issued_at: new Date().toISOString().substring(0, 10),
  amount: "",
  description: "",
  currency: "",
  doc_path: null,
};

export default function AddForm({
  type,
  defaultCurrency,
}: {
  type: OperationType;
  defaultCurrency: string;
}) {
  const [label, setLabel] = useState("");
  const [isPending, startTransition] = useTransition();
  const [records, setRecords] = useState<Operation[]>([]);
  const [singleRecord, setSingleRecord] = useState<Operation>({
    ...defaultRecord,
    id: v4(),
    currency: defaultCurrency,
  });

  const addRecord = async (e: React.FormEvent) => {
    e.preventDefault();
    setRecords((prev) => [...prev, singleRecord]);
    setSingleRecord((prev) => ({
      ...defaultRecord,
      id: v4(),
      currency: prev.currency,
    }));
  };

  return (
    <div className="flex flex-col xl:grid grid-cols-2 gap-4 sm:gap-8">
      <form onSubmit={addRecord}>
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
                operation={singleRecord}
                onChange={(key, value) =>
                  setSingleRecord((prev) => ({
                    ...prev,
                    [key]: value,
                  }))
                }
              />
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
      </form>
      <OperationTable
        title="Podgląd"
        type={type}
        rows={records}
        count={records.length}
        viewOnly={{
          setRows: setRecords,
        }}
      >
        <form
          className="flex-1 relative"
          action={(e) =>
            startTransition(async () => {
              const { error } = await addOperations(e);
              console.log({ error });
            })
          }
        >
          <div className="flex flex-col gap-8 justify-end h-full">
            {type === "expense" && (
              <LabelInput
                value={label}
                onChange={(lbl) => setLabel(lbl)}
                isDisabled={records.length === 0}
              />
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
      </OperationTable>
    </div>
  );
}
