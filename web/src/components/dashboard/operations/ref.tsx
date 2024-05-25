import numberFormat from "@/utils/formatters/currency";

export default function Operation(props: LatestOperation) {
  const operation = props;

  return (
    <div className="bg-white rounded-lg py-4 px-6 flex flex-col justify-between relative opacity-100 min-w-60">
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h3 className="text-lg line-clamp-1">{operation.title}</h3>
          <small className="text-neutral-500">
            {new Date(operation.issued_at).toLocaleDateString()}
          </small>
        </div>
        <div
          className={`${
            operation.type === "income"
              ? "bg-success-light text-success"
              : "bg-danger-light text-danger"
          } rounded-full px-1 py-0.5 text-2xl font-bold text-center`}
        >
          {(operation.type === "income" ? "+" : "-") +
            numberFormat(operation.currency, operation.amount)}
        </div>
      </div>
    </div>
  );
}
