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

  const {
    private: {
      "ai-assistant": dict,
      general: { incomes, expenses },
      operations: {
        expenses: {
          limits: {
            modal: {
              form: {
                period: { values: periodValues },
              },
            },
          },
        },
      },
    },
  } = await getDictionary(settings.language);

  return (
    <div className="sm:px-10 flex flex-col h-full gap-4 sm:gap-10 xl:grid grid-cols-2">
      <AIAssistantProvider defaultCurrency={settings.currency}>
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
              <OperationsContext
                dict={{ ...dict.context.form.operations, incomes, expenses }}
              />
              <LimitsContext
                dict={{
                  ...dict.context.form.limits,
                  _error: dict.context.form._error,
                  periodValues: periodValues,
                }}
                timezone={settings.timezone}
              />
              <GoalsContext
                dict={{
                  ...dict.context.form.goals,
                  _error: dict.context.form._error,
                }}
              />
            </div>
          </ScrollShadow>
        </Block>
      </AIAssistantProvider>
    </div>
  );
}
