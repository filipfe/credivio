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
          "border rounded-md max-w-[84%] bg-white px-4",
          from === "user" ? "self-end" : "self-start",
          typeof content === "string" ? "py-4" : "py-2"
        )}
      >
        {from === "user" ? (
          <p className="text-sm">{content}</p>
        ) : typeof content === "string" ? (
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
                <ul
                  className="list-disc list-outside pl-3.5 flex flex-col items-start gap-0.5"
                  {...props}
                >
                  {children}
                </ul>
              ),
              ol: ({ children, ...props }) => (
                <ol
                  className="list-decimal list-outside pl-3.5 flex flex-col items-start gap-1"
                  {...props}
                >
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
        ) : (
          content
        )}
      </div>
    </div>
  );
}
