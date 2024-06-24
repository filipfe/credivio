"use client";

import { Button, Input } from "@nextui-org/react";
import { CheckIcon, CopyIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export default function TokenInput({ token }: { token: string }) {
  const [copied, setCopied] = useState(false);
  const timeout = useRef<number | null>(null);

  useEffect(() => {
    if (!copied) return;
    timeout.current = window.setTimeout(() => setCopied(false), 5000);
    return () => {
      timeout.current && window.clearTimeout(timeout.current);
    };
  }, [copied]);

  return (
    <div className="relative flex items-center max-w-md">
      <Input
        type="text"
        autoComplete="off"
        value={token}
        readOnly
        disableAnimation
        label="Klucz Telegram"
        classNames={{
          inputWrapper:
            "!bg-light border border-primary/10 shadow-none select-none",
        }}
        onClick={() => navigator.clipboard.writeText(token)}
      />
      <Button
        isIconOnly
        disableRipple
        className="border border-primary/10 absolute right-2"
        onClick={() => {
          navigator.clipboard.writeText(token);
          setCopied(true);
        }}
      >
        {copied ? <CheckIcon size={16} /> : <CopyIcon size={16} />}
      </Button>
    </div>
  );
}
