"use client";

import { Button, Spinner, Tab, Tabs } from "@nextui-org/react";
import {
  CheckIcon,
  FileSpreadsheetIcon,
  ScanTextIcon,
  WrenchIcon,
} from "lucide-react";
import { Fragment, useState, useTransition } from "react";
import { addOperations } from "@/lib/operations/actions";
import OperationTable from "./table";
import { v4 } from "uuid";
import Block from "../ui/block";
import Scan from "./inputs/scan";
import CSVInput from "./inputs/csv";
import operationFormatter from "@/utils/formatters/operations";
import Manual from "./inputs/manual";
import LabelInput from "./inputs/label";

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
              defaultCurrency={defaultCurrency}
              onAdd={(record) => setRecords((prev) => [...prev, record])}
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
