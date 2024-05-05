export default function Budget({
  amount,
  currency,
}: Pick<Operation, "amount" | "currency">) {
  return (
    <div className="bg-white rounded-lg py-8 px-10 space-y-4">
      <h4 className="text-3xl">
        {amount} {currency}
      </h4>
    </div>
  );
}
