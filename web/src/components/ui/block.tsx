import { cn } from "@nextui-org/react";

type Props = {
  title?: string | React.ReactNode;
  cta?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  mobileRadius?: boolean;
  hideTitleMobile?: boolean;
  description?: string;
};

export default function Block({
  children,
  cta,
  className,
  mobileRadius,
  description,
  title,
  hideTitleMobile,
}: Props) {
  return (
    <article
      className={cn(
        "bg-white px-6 sm:px-10 pt-5 pb-6 sm:py-8 gap-4 flex flex-col",
        className,
        mobileRadius
          ? "rounded-md border"
          : "border-y sm:border-x sm:rounded-md"
      )}
    >
      {title && (
        <div className="flex items-center gap-4 justify-between mb-1 sm:mb-2 h-8">
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
      {description && (
        <p className="-mt-3 text-sm text-font/60 mb-1 sm:mb-2">{description}</p>
      )}
      {children}
    </article>
  );
}
