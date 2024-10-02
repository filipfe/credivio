import Chat from "@/components/ai-assistant/chat";
import GoalsContext from "@/components/ai-assistant/context/goals";
import LimitsContext from "@/components/ai-assistant/context/limits";
import OperationsContext from "@/components/ai-assistant/context/operations";
import Block from "@/components/ui/block";
import AIAssistantProvider from "./providers";
import { ScrollShadow } from "@nextui-org/react";

export default function Page() {
  return (
    <div className="sm:px-10 py-4 sm:py-8 flex flex-col h-full gap-4 sm:gap-6 xl:grid grid-cols-2">
      <AIAssistantProvider>
        {/* <Chat /> */}
        <Block
          title="Zbuduj kontekst"
          description="Wybierz informacje, które mają być przetworzone przez asystenta"
        >
          <ScrollShadow className="max-h-[calc(100vh-298px)]" hideScrollBar>
            <div>
              <OperationsContext />
              <LimitsContext />
              <GoalsContext />
            </div>
          </ScrollShadow>
        </Block>
      </AIAssistantProvider>
    </div>
  );
}
