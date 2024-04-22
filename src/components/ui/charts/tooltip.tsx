type Props = {
  active: boolean;
  payload: any;
  label: string;
};

export default function CustomTooltip({ active, payload, label }: Props) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-">
        <p>{`${label} : ${payload[0].value}`}</p>
      </div>
    );
  }

  return null;
}
