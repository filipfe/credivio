import { cn } from "@nextui-org/react";

type Props = {
  title?: string | React.ReactNode;
  cta?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  mobileRadius?: boolean;
  hideTitleMobile?: boolean;
};

export default function Block({
  children,
  cta,
  className,
  mobileRadius,
  title,
  hideTitleMobile,
}: Props) {
  return (
    <article
      className={cn(
        "bg-white border border-primary/10 px-6 sm:px-10 pt-5 pb-6 sm:py-8 gap-4 flex flex-col",
        className,
        mobileRadius ? "rounded-md" : "sm:rounded-md"
      )}
    >
      {title && (
        <div className="flex items-center gap-4 justify-between mb-1 sm:mb-2">
          {typeof title === "string" ? (
            <h3
              className={`sm:text-lg text-base ${
                hideTitleMobile ? "hidden sm:block" : "block"
              }`}
            >
              {title}
            </h3>
          ) : (
            title
          )}
          {cta}
        </div>
      )}
      {children}
    </article>
  );
}
