import GoalsContext from "@/components/ai-assistant/context/goals";
import LimitsContext from "@/components/ai-assistant/context/limits";
import OperationsContext from "@/components/ai-assistant/context/operations";
import Block, { Section } from "@/components/ui/block";
import { Button, Input } from "@nextui-org/react";
import { Send } from "lucide-react";

export default function Page() {
  return (
    <div className="sm:px-10 py-4 sm:py-8 flex flex-col h-full gap-4 sm:gap-6 xl:grid grid-cols-2">
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
        <Input
          radius="full"
          size="lg"
          placeholder="Wykryj anomalie w wybranych wydatkach"
          endContent={
            <Button
              className="relative left-2"
              size="sm"
              radius="full"
              color="primary"
              disableRipple
            >
              <Send size={20} />
              Wyślij
            </Button>
          }
          classNames={{
            inputWrapper: "shadow-none !bg-white border",
            input: "text-sm",
          }}
        />
      </div>
      <Block
        title="Zbuduj kontekst"
        description="Wybierz informacje, które mają być przetworzone przez asystenta"
      >
        <div>
          <OperationsContext />
          <LimitsContext />
          <GoalsContext />
        </div>
      </Block>
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
