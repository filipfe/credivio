import { Coins, Repeat, Wallet2 } from "lucide-react";

type Operation = {
  icon: React.ReactNode;
  title: string;
  description: string;
};

const operations: Operation[] = [
  {
    icon: <Wallet2 size={24} strokeWidth={2.5} className="text-primary" />,
    title: "Przychody",
    description:
      "Businesses struggle to make sense of vast amounts of complex data, missing out on valuable insights that could drive growth and innovation.",
  },
  {
    icon: <Coins size={24} strokeWidth={2.5} className="text-primary" />,
    title: "Wydatki",
    description:
      "Businesses struggle to make sense of vast amounts of complex data, missing out on valuable insights that could drive growth and innovation.",
  },
  {
    icon: <Repeat size={24} strokeWidth={2.5} className="text-primary" />,
    title: "Płatności cykliczne",
    description:
      "Businesses struggle to make sense of vast amounts of complex data, missing out on valuable insights that could drive growth and innovation.",
  },
];

export default function Operations() {
  return (
    <section className="py-16 lg:py-24 px-6" id="problem">
      <div>
        <div className="relative container mx-auto max-w-7xl">
          <div className="text-center space-y-4 pb-6 mx-auto">
            <h2 className="text-primary font-mono font-medium tracking-wider uppercase">
              Operacje
            </h2>
            <h3 className="mx-auto mt-4 max-w-xs font-semibold sm:max-w-none text-3xl sm:text-4xl lg:text-5xl">
              Manually entering your data is a hassle.
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-12 lg:gap-16 mt-6 sm:mt-12">
            {operations.map((operation) => (
              <OperationRef {...operation} key={operation.title} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

const OperationRef = ({ icon, title, description }: Operation) => (
  <div className="rounded-lg border text-card-foreground bg-background border-none shadow-none">
    <div className="flex flex-col gap-3">
      <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center">
        {icon}
      </div>
      <h3 className="text-lg lg:text-xl font-semibold mt-3">{title}</h3>
      <p className="text-font/60 text-sm leading-relaxed">{description}</p>
    </div>
  </div>
);
