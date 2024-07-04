"use client";

import { XIcon } from "lucide-react";
import toast, { Toast as ToastProps } from "react-hot-toast";
import { AnimatePresence, motion } from "framer-motion";

export default function Toast({ id, type, message, visible }: ToastProps) {
  const isError = type === "error";
  const isBlank = type === "blank";
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ transform: `translateX(-50%)`, opacity: 0 }}
          animate={{ transform: `translateX(0%)`, opacity: 1 }}
          exit={{ transform: `translateX(50%)`, opacity: 0 }}
          className={`rounded-md max-w-sm border py-4 px-6 flex items-center gap-8 bg-white border-primary/10 ${
            visible ? "animate-enter" : "animate-exit"
          }`}
          key="toast"
        >
          <div className="flex flex-col gap-1">
            <div className="flex items-start gap-2.5">
              {!isBlank && (
                <div
                  className={`h-2.5 w-2.5 mt-1.5 min-w-2.5 rounded-full ${
                    isError ? "bg-danger" : "bg-success"
                  }`}
                />
              )}
              <p className="text-sm mb-0.5">
                {isError ? "Something went wrong!" : message?.toString()}
              </p>
            </div>
            {isError && (
              <p className="text-sm opacity-80">{message?.toString()}</p>
            )}
          </div>
          <button
            onClick={() => toast.remove(id)}
            className="border border-white/60 h-6 w-6 rounded-md grid place-content-center"
          >
            <XIcon size={14} />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
