import { cn } from "@nextui-org/react";
import Markdown from "react-markdown";

export default function MessageRef({ from, content }: ChatMessage) {
  return (
    <div
      className={cn(
        "flex items-start gap-3",
        from === "user" ? "flex-row-reverse" : "flex-row"
      )}
    >
      <div className="h-10 w-10 rounded-full border bg-white grid place-content-center">
        <p>{from === "assistant" ? "A" : "F"}</p>
      </div>
      <div
        className={cn(
          "p-4 border rounded-md max-w-[84%] bg-white",
          from === "user" ? "self-end" : "self-start"
        )}
      >
        {from === "user" ? (
          <p className="text-sm">{content}</p>
        ) : (
          <Markdown
            className="flex flex-col gap-3"
            components={{
              h3: ({ children, ...props }) => (
                <h3 className="mt-1.5 text-sm font-bold" {...props}>
                  {children}
                </h3>
              ),
              p: ({ children, ...props }) => (
                <p className="text-sm" {...props}>
                  {children}
                </p>
              ),
              ul: ({ children, ...props }) => (
                <ul className="list-disc pl-3.5 grid gap-0.5" {...props}>
                  {children}
                </ul>
              ),
              ol: ({ children, ...props }) => (
                <ol className="list-decimal pl-3.5 grid gap-1" {...props}>
                  {children}
                </ol>
              ),
              li: ({ children, ...props }) => (
                <li className="text-sm" {...props}>
                  {children}
                </li>
              ),
            }}
          >
            {content}
          </Markdown>
        )}
      </div>
    </div>
  );
}
