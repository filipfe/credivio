import { cn } from "@nextui-org/react";

type Props = {
  title?: string | React.ReactNode;
  cta?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  mobileRadius?: boolean;
};

export default function Block({
  children,
  cta,
  className,
  mobileRadius,
  title,
}: Props) {
  return (
    <section
      className={cn(
        "bg-white px-6 sm:px-10 py-8 gap-4 flex flex-col",
        className,
        mobileRadius ? "rounded-md" : "sm:rounded-md"
      )}
    >
      {title && (
        <div className="flex items-center gap-4 justify-between mb-2">
          {typeof title === "string" ? (
            <h2 className="text-lg">{title}</h2>
          ) : (
            title
          )}
          {cta}
        </div>
      )}
      {children}
    </section>
  );
}
