import { cn } from "@nextui-org/react";
import { Check, ChevronRight } from "lucide-react";

type Props = {
  title: string;
  children: React.ReactNode;
  step: number;
  index: number;
  disabled?: boolean;
  onOpen: () => void;
};

export default function Dropdown({
  children,
  title,
  step,
  index,
  onOpen,
  disabled,
}: Props) {
  const isOpen = step === index;
  const isDisabled = disabled || step + 1 < index;
  const isCompleted = step > index;
  return (
    <div className="bg-white rounded-md border">
      <button
        type="button"
        disabled={isDisabled}
        className="flex items-center gap-4 justify-between disabled:opacity-40 w-full p-4"
        onClick={onOpen}
      >
        <div className="flex items-center gap-3">
          <div
            className={cn(
              "border h-5 w-5 rounded-full transition-colors grid place-content-center",
              isCompleted ? "border-primary bg-primary" : "bg-white"
            )}
          >
            <Check className="text-white" size={14} />
          </div>
          <h4 className="font-medium text-sm">{title}</h4>
        </div>
        <ChevronRight
          size={16}
          className={cn(
            "transition-transform text-font/60",
            isOpen && "rotate-90"
          )}
        />
      </button>
      <div
        className={cn(
          "grid transition-all",
          isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        )}
      >
        <div className="overflow-hidden px-4">
          <div className="pb-5 pt-1 flex flex-col gap-4">{children}</div>
        </div>
      </div>
    </div>
  );
}
