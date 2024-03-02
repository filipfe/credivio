export default function OperationRef({
  type,
  amount,
  title,
  currency,
  description,
  issued_at,
}: Operation) {
  return (
    <div className="bg-white rounded-lg py-8 px-10">
      <small className="text-primary">
        {new Date(issued_at).toLocaleDateString()}
      </small>
      <h3 className="text-lg line-clamp-1">{title}</h3>
      <h4 className="text-3xl my-4">
        {type === "expense" ? "-" : "+"}
        {amount} {currency}
      </h4>
      {description && <p>{description}</p>}
    </div>
  );
}
