type Props = {
  title?: string | React.ReactNode;
  cta?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
};

export default function Block({ children, cta, className, title }: Props) {
  return (
    <section
      className={`bg-white rounded-md px-10 py-8 gap-4 flex flex-col ${
        className || ""
      }`}
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
