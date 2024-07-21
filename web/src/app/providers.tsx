"use client";

import Toast from "@/components/ui/toast";
import toast from "react-hot-toast";
import { SWRConfig } from "swr";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SWRConfig
      value={{
        onError: () =>
          toast.custom((t) => (
            <Toast
              {...t}
              type="error"
              message="Wystąpił błąd, przy przetwarzaniu zapytania!"
            />
          )),
      }}
    >
      {children}
    </SWRConfig>
  );
}
