"use client";

import { useAIAssistant } from "@/app/(private)/(sidebar)/ai-assistant/providers";
import { createClient } from "@/utils/supabase/client";
import toast from "@/utils/toast";
import { Button, Input, ScrollShadow } from "@nextui-org/react";
import { Send } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import MessageRef from "./chat/message";
import { Dict } from "@/const/dict";

export default function Chat({
  dict,
}: {
  dict: Dict["private"]["ai-assistant"]["chat"];
}) {
  const { limit, goal, operations, currency } = useAIAssistant();
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    scrollRef.current &&
      scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [isLoading]);

  const onSubmit = async (
    input: string,
    _operations?: Record<"incomes" | "expenses" | "recurring_payments", boolean>
  ) => {
    if (!input) return;
    setMessages((prev) => [...prev, { from: "user", content: input }]);
    setIsLoading(true);
    setInput("");

    const supabase = createClient();
    const { data, error } = await supabase.functions.invoke("ai-assistant", {
      body: {
        currency,
        operations: _operations || operations,
        input,
        limit,
        goal,
      },
    });
    if (error) {
      toast({
        type: "error",
        message: "Wystąpił błąd przy przetwarzaniu zapytania",
      });
    } else {
      setMessages((prev) => [
        ...prev,
        { from: "assistant", content: data.message },
      ]);
    }
    setIsLoading(false);
  };

  return (
    <div className="flex flex-col px-6 sm:px-0 xl:mb-8 pb-6 xl:pb-0 h-[calc(100vh-64px)] sm:h-[calc(100vh-80px)] xl:h-auto">
      <div className="flex-1 flex flex-col justify-center">
        {messages.length === 0 ? (
          <div className="grid-cols-2 grid lg:grid-cols-3 gap-4 mx-6">
            {dict.recomendation.map((r) => (
              <RecommendationRef {...r} onSubmit={onSubmit} />
            ))}
          </div>
        ) : (
          <ScrollShadow
            ref={scrollRef}
            className="h-full max-h-[calc(100vh-160px)] pt-4 sm:pt-8 xl:pb-6"
            hideScrollBar
          >
            <div className="flex flex-col gap-4 min-h-max">
              {messages
                .slice(messages.length - 4, messages.length)
                .map((message, k) => (
                  <MessageRef
                    {...message}
                    content={message.content}
                    key={message.from + k}
                  />
                ))}
              {isLoading && (
                <MessageRef from="assistant" content={<l-bouncy size={24} />} />
              )}
            </div>
          </ScrollShadow>
        )}
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit(input);
        }}
      >
        <Input
          radius="full"
          size="lg"
          placeholder={dict.input.placeholder}
          value={input}
          endContent={
            <Button
              className="relative left-2"
              size="sm"
              radius="full"
              color="primary"
              disableRipple
              type="submit"
              isDisabled={!input || isLoading}
            >
              <Send size={20} />
              {dict._submit.label}
            </Button>
          }
          onValueChange={(value) => setInput(value)}
          classNames={{
            inputWrapper: "shadow-none !bg-white border h-12",
            input: "text-sm",
          }}
        />
      </form>
    </div>
  );
}

const RecommendationRef = ({
  title,
  category,
  onSubmit,
  requirements,
}: {
  title: string;
  category: string;
  onSubmit: (
    input: string,
    _operations?: Record<"incomes" | "expenses" | "recurring_payments", boolean>
  ) => void;
  requirements?: string[];
}) => {
  const { goal, setOperations } = useAIAssistant();
  const isDisabled = requirements && requirements.includes("goals") && !goal;
  return (
    <button
      disabled={isDisabled}
      onClick={() => {
        requirements &&
          requirements.includes("operations") &&
          setOperations({
            incomes: true,
            expenses: true,
            recurring_payments: true,
          });
        onSubmit(title, {
          incomes: true,
          expenses: true,
          recurring_payments: true,
        });
      }}
      className="p-3 border rounded-md select-none bg-white disabled:opacity-60"
    >
      <div className="text-left">
        <h5 className="text-primary font-medium text-xs">{category}</h5>
        <h4 className="font-medium text-sm">{title}</h4>
      </div>
    </button>
  );
};
