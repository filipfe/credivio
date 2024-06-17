"use client";

import { createClient } from "@/utils/supabase/client";
import { ScanLineIcon } from "lucide-react";
import { Dispatch, SetStateAction, useCallback, useState } from "react";
import { v4 } from "uuid";
import { hatch } from "ldrs";
import dynamic from "next/dynamic";

const Dropzone = dynamic(() => import("react-dropzone"), { ssr: false });

hatch.register();

type Props = {
  setRecords: Dispatch<SetStateAction<Operation[]>>;
};

export default function Scan({ setRecords }: Props) {
  const [isLoading, setIsLoading] = useState(false);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    setIsLoading(true);
    const formData = new FormData();
    acceptedFiles.forEach((file) => {
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
  }, []);

  return (
    <Dropzone
      onDrop={onDrop}
      disabled={isLoading}
      accept={{
        "image/png": [".png"],
        "image/jpeg": [".jpeg"],
        //   "application/pdf": [".pdf"],
      }}
    >
      {({ getRootProps, getInputProps }) => (
        <label
          {...getRootProps({
            className:
              "border border-dashed border-primary/60 py-8 rounded-md flex flex-col gap-4 items-center justify-center",
          })}
        >
          <input {...getInputProps()} />
          {isLoading ? (
            <l-hatch size="28" stroke="4" speed="3.5" color="black"></l-hatch>
          ) : (
            <>
              <ScanLineIcon size={28} />
              <p className="text-sm">Dodaj lub upuść pliki</p>
            </>
          )}
        </label>
      )}
    </Dropzone>
  );
}
