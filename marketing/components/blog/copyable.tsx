"use client";

import { useState } from "react";

export default function Copyable({ content }: { content: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <div className="relative flex items-center max-w-max">
      <div className="py-3 px-4 bg-light border pr-24 rounded-md">
        {content}
      </div>
      <button
        className="border h-8 w-8 rounded absolute right-2"
        onClick={() => {
          navigator.clipboard.writeText(content);
          setCopied(true);
        }}
      ></button>
    </div>
  );
}
