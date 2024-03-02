import { ArrowDownIcon, ArrowUpIcon } from "lucide-react";

type Props = {
  previous: Pick<Operation, "amount">;
};

export default function Stat({
  title,
  amount,
  description,
  currency,
  previous: { amount: prevAmount },
}: Pick<Operation, "title" | "amount" | "description" | "currency"> & Props) {
  const floatAmount = parseFloat(amount);
  const floatPrevAmount = parseFloat(prevAmount);
  const percent = (
    (Math.abs(floatPrevAmount - floatAmount) /
      Math.max(floatPrevAmount, floatAmount)) *
    100
  ).toFixed(2);
  return (
    <div className="col-span-2 bg-white rounded-lg py-8 px-10 space-y-4">
      <h3 className="text-lg">{title}</h3>
      <div className="flex items-center gap-2">
        <h4 className="text-3xl">
          {amount} {currency}
        </h4>
        {amount !== prevAmount &&
          (amount > prevAmount ? (
            <div className="bg-success-light text-success flex items-center gap-1 rounded-full px-1 py-0.5 font-medium text-sm">
              <ArrowUpIcon size={16} />
              {percent}%
            </div>
          ) : (
            <div className="bg-danger-light text-danger flex items-center gap-1 rounded-full px-1 py-0.5 font-medium text-sm">
              <ArrowDownIcon size={16} />
              {percent}%
            </div>
          ))}
      </div>
      {description && <p>{description}</p>}
    </div>
  );
}
