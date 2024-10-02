import { cn } from "@nextui-org/react";

interface Props {
  children: React.ReactNode;
  isActive: boolean;
  onActiveChange: (checked: boolean) => void;
  id: string;
  className?: string;
  highlight?: "default" | "outline";
}

export default function Option({
  children,
  isActive,
  onActiveChange,
  id,
  className,
  highlight = "default",
}: Props) {
  return (
    <label
      htmlFor={id}
      className={cn(
        "p-3 border rounded-md cursor-pointer select-none",
        isActive
          ? highlight === "default"
            ? "bg-primary border-primary text-white"
            : "border-primary/60 text-primary bg-primary/10"
          : "hover:bg-light",
        className
      )}
    >
      <input
        className="sr-only"
        type="checkbox"
        name={id}
        id={id}
        checked={isActive}
        onChange={(e) => onActiveChange(e.target.checked)}
      />
      {children}
    </label>
  );
}
