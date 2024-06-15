"use client";

import { createClient } from "@/utils/supabase/client";
import { ScanLineIcon } from "lucide-react";
import { Dispatch, SetStateAction, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { v4 } from "uuid";

type Props = {
  setRecords: Dispatch<SetStateAction<Operation[]>>;
};

export default function Scan({ setRecords }: Props) {
  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const formData = new FormData();
    acceptedFiles.forEach((file) => {
      formData.append(v4(), file);
    });
    const supabase = createClient();
    const { data } = await supabase.functions.invoke("process-receipt", {
      body: formData,
    });
    console.log(data);
    data && setRecords(data.operations);
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/png": [".png"],
      "image/jpeg": [".jpeg"],
      //   "application/pdf": [".pdf"],
    },
  });

  return (
    <label
      {...getRootProps({
        className:
          "border border-dashed border-primary/60 py-8 rounded-md flex flex-col gap-4 items-center justify-center",
      })}
    >
      <input {...getInputProps({})} />
      <ScanLineIcon size={28} />
      <p className="text-sm">Dodaj lub upuść pliki</p>
    </label>
  );
}
