"use client";

import { Tab, Tabs } from "@nextui-org/react";
import { ScanTextIcon, WrenchIcon } from "lucide-react";
import { useState } from "react";
import { addOperations } from "@/lib/operations/actions";
import Block from "../ui/block";
import Scan from "./inputs/scan";
import Manual from "./inputs/manual";
import LabelInput from "./inputs/label";
import PreviewTable from "../ui/preview-table";
import Form from "../ui/form";
import { Dict } from "@/const/dict";

export default function AddForm({
  dict,
  type,
  defaultCurrency,
}: {
  dict: {
    add: Dict["private"]["operations"]["add"];
    table: Dict["private"]["operations"]["operation-table"];
  };
  type: OperationType;
  defaultCurrency: string;
}) {
  const [records, setRecords] = useState<Operation[]>([]);

  return records.length > 0 ? (
    <PreviewTable
      title={dict.add.tab.scan.title}
      dict={dict.table}
      type={type}
      rows={records}
      count={records.length}
      setRows={setRecords as any}
    >
      <Form
        mutation={addOperations}
        successMessage="Pomyślnie dodano operacje!"
      >
        <div className="flex flex-col justify-end h-full mt-6">
          {type === "expense" && (
            <LabelInput dict={dict.table.dropdown.modal.edit.form.label} />
          )}
          <input type="hidden" name="type" value={type} />
          <input type="hidden" name="data" value={JSON.stringify(records)} />
        </div>
      </Form>
    </PreviewTable>
  ) : (
    <Block
      title={dict.add.title[type as "income" | "expense"]}
      className="max-w-3xl w-full mx-auto"
    >
      <Tabs
        defaultSelectedKey="manual"
        classNames={{
          cursor: "shadow-none border rounded-md",
          panel: "p-0",
        }}
      >
        <Tab
          key="manual"
          title={
            <div className="flex items-center gap-2">
              <WrenchIcon size={16} opacity={0.8} />
              <span>{dict.add.tab.manual.title}</span>
            </div>
          }
        >
          <Form
            mutation={addOperations}
            id="add-form"
            buttonProps={{ form: "add-form", children: "Zapisz" }}
            successMessage="Pomyślnie dodano operację!"
          >
            <Manual
              dict={dict.table.dropdown.modal.edit.form}
              withLabel={type === "expense"}
              type={type}
              defaultCurrency={defaultCurrency}
            />
          </Form>
        </Tab>
        {/* <Tab
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
        </Tab> */}
        <Tab
          key="scan"
          title={
            <div className="flex items-center gap-2">
              <ScanTextIcon size={16} opacity={0.8} />
              <span>{dict.add.tab.scan.title}</span>
            </div>
          }
        >
          <Scan
            description={dict.add.tab.scan.description}
            type={type}
            setRecords={setRecords}
          />
        </Tab>
      </Tabs>
    </Block>
  );
}
