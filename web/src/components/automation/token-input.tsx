"use client";

import { Button, Input } from "@nextui-org/react";
import { CheckIcon, CopyIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export default function TokenInput({
  token,
  dict,
}: {
  token: string;
  dict: { label: string };
}) {
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
    <div className="relative flex items-center flex-1">
      <Input
        type="text"
        autoComplete="off"
        value={token}
        readOnly
        disableAnimation
        label={dict.label}
        classNames={{
          inputWrapper: "!bg-light border shadow-none select-none",
        }}
        onClick={() => navigator.clipboard.writeText(token)}
      />
      <Button
        isIconOnly
        disableRipple
        className="border absolute right-2"
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
