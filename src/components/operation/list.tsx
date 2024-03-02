import OperationRef from "./ref";

type Props = {
  operations: Operation[];
  type: OperationType;
};

export default function OperationList({ operations, type }: Props) {
  return (
    <section className="grid grid-cols-4 gap-6">
      {operations.map((item, k) => (
        <OperationRef {...item} type={type} key={`op:${k}`} />
      ))}
    </section>
  );
}
