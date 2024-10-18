import { cn } from "@nextui-org/react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { motion } from "framer-motion";

export default function MessageRef({ from, content }: ChatMessage) {
  return (
    <motion.div
      initial={{ translateX: from === "assistant" ? -16 : 16, opacity: 0 }}
      animate={{ translateX: 0, opacity: 1 }}
      className={cn(
        "flex items-start gap-3",
        from === "user" ? "flex-row-reverse" : "flex-row"
      )}
    >
      <div className="h-10 w-10 rounded-full border bg-white place-content-center hidden sm:grid">
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
            remarkPlugins={[remarkGfm]}
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
              table: ({ children, ...props }) => (
                <table className="table-fixed w-full" {...props}>
                  {children}
                </table>
              ),
              th: ({ children, ...props }) => (
                <th
                  className="text-sm text-left py-1 px-2 first:pl-0 last:pr-0"
                  {...props}
                >
                  {children}
                </th>
              ),
              td: ({ children, ...props }) => (
                <td
                  className="text-sm text-left border-t py-1 whitespace-nowrap text-ellipsis overflow-hidden px-2 first:pl-0 last:pr-0"
                  {...props}
                >
                  {children}
                </td>
              ),
            }}
          >
            {content}
          </Markdown>
        ) : (
          content
        )}
      </div>
    </motion.div>
  );
}
