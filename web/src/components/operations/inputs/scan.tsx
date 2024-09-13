"use client";

import Dropzone from "@/components/ui/dropzone";
import { createClient } from "@/utils/supabase/client";
import toast from "@/utils/toast";
import { ScanLineIcon } from "lucide-react";
import {
  Dispatch,
  DragEvent,
  SetStateAction,
  useCallback,
  useState,
} from "react";
import { v4 } from "uuid";

type Props = {
  type: OperationType;
  setRecords: Dispatch<SetStateAction<Operation[]>>;
};

export default function Scan({ type, setRecords }: Props) {
  const [isLoading, setIsLoading] = useState(false);

  const onChange = async (files: File[]) => {
    setIsLoading(true);
    const formData = new FormData();
    files.forEach((file) => {
      formData.append(v4(), file);
    });
    const supabase = createClient();
    const { data } = await supabase.functions.invoke("process-receipt", {
      body: formData,
    });
    const operations = data.operations.map((operation: Operation) => {
      const { type, ...rest } = operation;
      return rest;
    });
    console.log({ operations });
    data && setRecords((prev) => [...prev, ...operations]);
    setIsLoading(false);
  };

  return (
    <Dropzone
      id="scan-input"
      allowedTypes={["image/png", "image/jpeg"]}
      onChange={onChange}
      className={type === "expense" ? "h-[382px]" : "h-[310px]"}
    >
      {isLoading ? (
        <l-hatch size="28" stroke="4" speed="3.5" color="black"></l-hatch>
      ) : (
        <>
          <ScanLineIcon size={28} />
          <p className="text-sm">Dodaj lub upuść pliki</p>
        </>
      )}
    </Dropzone>
  );
}
