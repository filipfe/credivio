import Chat from "@/components/ai-assistant/chat";
import GoalsContext from "@/components/ai-assistant/context/goals";
import LimitsContext from "@/components/ai-assistant/context/limits";
import OperationsContext from "@/components/ai-assistant/context/operations";
import Block from "@/components/ui/block";
import AIAssistantProvider from "./providers";
import { ScrollShadow } from "@nextui-org/react";
import { getSettings } from "@/lib/general/actions";
import CurrencyPicker from "@/components/ai-assistant/context/currency";
import getDictionary from "@/const/dict";

export default async function Page() {
  const settings = await getSettings();

  const dict = (await getDictionary(settings.language)).private["ai-assistant"];

  return (
    <div className="sm:px-10 flex flex-col h-full gap-4 sm:gap-10 xl:grid grid-cols-2">
      <AIAssistantProvider>
        <Chat dict={dict.chat} />
        <Block
          title={dict.context.title}
          description={dict.context.description}
          className="my-4 sm:my-8"
        >
          <ScrollShadow
            className="max-h-[calc(100vh-298px)] flex-1"
            hideScrollBar
          >
            <div>
              <CurrencyPicker dict={dict.context.form.currency} />
              <OperationsContext dict={dict.context.form.operations} />
              <LimitsContext
                dict={dict.context.form.limits}
                timezone={settings.timezone}
              />
              <GoalsContext dict={dict.context.form.goals} />
            </div>
          </ScrollShadow>
        </Block>
      </AIAssistantProvider>
    </div>
  );
}
