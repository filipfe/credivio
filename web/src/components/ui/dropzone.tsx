import toast from "@/utils/toast";
import { cn } from "@nextui-org/react";
import { DragEvent } from "react";

type Props = {
  children?: React.ReactNode;
  allowedTypes: string[];
  id: string;
  className?: string;
  onChange: (files: File[]) => void;
};

export default function Dropzone({
  children,
  id,
  allowedTypes,
  className,
  onChange,
}: Props) {
  const onDrop = async (e: DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!e.dataTransfer.files || e.dataTransfer.files.length === 0) return;
    const files = [...e.dataTransfer.files];
    const { valid, invalid } = files.reduce(
      (prev, file) =>
        allowedTypes.includes(file.type)
          ? { ...prev, valid: [...prev.valid, file] }
          : { ...prev, invalid: [...prev.invalid, file] },
      { valid: [] as File[], invalid: [] as File[] }
    );
    if (invalid.length > 0) {
      toast({
        type: "error",
        message: `Pliki ${invalid
          .map((file) => file.name)
          .join(", ")} nie mogły zostać przetworzone`,
      });
    }
    if (valid.length === 0) return;
    onChange(valid);
  };

  const preventDefault = (e: DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };
  return (
    <label
      htmlFor={id}
      className={cn(
        "border border-dashed border-neutral-300 py-8 rounded-md flex flex-col gap-4 items-center justify-center",
        className
      )}
      onDrop={onDrop}
      onDragEnter={preventDefault}
      onDragLeave={preventDefault}
      onDragOver={preventDefault}
    >
      <input
        className="sr-only"
        id={id}
        type="file"
        multiple
        accept={allowedTypes.join(", ")}
        onChange={(e) =>
          e.target.files &&
          e.target.files.length > 0 &&
          onChange([...e.target.files])
        }
      />
      {children}
    </label>
  );
}
