"use client";

import { XIcon } from "lucide-react";
import toast, { Toast as ToastProps } from "react-hot-toast";

export default function Toast({
  id,
  type,
  message,
  createdAt,
  visible,
}: ToastProps) {
  const isError = type === "error";
  const isBlank = type === "blank";
  return (
    <div
      className={`rounded-md border py-4 px-6 flex items-center gap-8 bg-white border-primary/10 shadow-lg ${
        visible ? "animate-enter" : "animate-exit"
      }`}
    >
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2.5">
          {!isBlank && (
            <div
              className={`h-2.5 w-2.5 rounded-full ${
                isError ? "bg-danger" : "bg-primary"
              }`}
            />
          )}
          <p className="text-sm mb-0.5">
            {isError ? "Something went wrong!" : message?.toString()}
          </p>
        </div>
        {isError && <p className="text-sm opacity-80">{message?.toString()}</p>}
      </div>
      <button
        onClick={() => toast.remove(id)}
        className="border border-white/60 h-6 w-6 rounded-md grid place-content-center"
      >
        <XIcon size={14} />
      </button>
    </div>
  );
}
