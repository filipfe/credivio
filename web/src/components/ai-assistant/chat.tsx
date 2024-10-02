"use client";

import { useAIAssistant } from "@/app/(private)/ai-assistant/providers";
import { createClient } from "@/utils/supabase/client";
import toast from "@/utils/toast";
import { Button, Input } from "@nextui-org/react";
import { Send } from "lucide-react";
import { FormEvent, useState } from "react";

export default function Chat() {
  const { limit, goal } = useAIAssistant();
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (e?: FormEvent) => {
    e?.preventDefault();
    if (!input) return;
    setIsLoading(true);
    const supabase = createClient();
    const { data, error } = await supabase.functions.invoke("ai-assistant", {
      body: {
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
      console.log(data);
    }
    setIsLoading(false);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex-1 flex flex-col justify-center">
        <div className="grid grid-cols-3 gap-4 mx-6">
          <RecommendationRef title="Wygeneruj prasówkę" />
          <RecommendationRef title="Example" />
          <RecommendationRef title="Example" />
          <RecommendationRef title="Example" />
          <RecommendationRef title="Example" />
          <RecommendationRef title="Example" />
        </div>
      </div>
      <form onSubmit={onSubmit}>
        <Input
          radius="full"
          size="lg"
          placeholder="Wykryj anomalie w wybranych wydatkach"
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
              Wyślij
            </Button>
          }
          onValueChange={(value) => setInput(value)}
          classNames={{
            inputWrapper: "shadow-none !bg-white border",
            input: "text-sm",
          }}
        />
      </form>
    </div>
  );
}

const RecommendationRef = ({ title }: { title: string }) => (
  <button className="p-3 border rounded-md cursor-pointer select-none bg-white">
    <div className="text-left">
      <h4 className="font-medium text-sm">{title}</h4>
    </div>
  </button>
);
