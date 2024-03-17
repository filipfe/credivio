import { Button, Progress } from "@nextui-org/react";
import { CheckCircle2Icon, PlusIcon } from "lucide-react";

export default function GoalRef({
  currency,
  // saved,
  created_at,
  title,
  description,
  price,
}: Goal) {
  const saved = 10000;
  const isCompleted = saved >= price;
  const formatter = new Intl.NumberFormat("pl-PL", {
    style: "currency",
    currency,
  });
  return (
    <div
      className={`bg-white rounded-lg py-8 px-10 relative ${
        isCompleted ? "opacity-80" : "opacity-100"
      }`}
    >
      {isCompleted ? (
        <div className="absolute right-10 top-8 text-primary">
          <CheckCircle2Icon />
        </div>
      ) : (
        <Button
          isIconOnly
          variant="flat"
          color="primary"
          className="absolute right-10 top-8"
          size="sm"
          radius="md"
        >
          <PlusIcon size={16} />
        </Button>
      )}
      <small className="text-primary">
        {new Date(created_at).toLocaleDateString()}
      </small>
      <h3 className="text-lg line-clamp-1">{title}</h3>
      <Progress
        color="primary"
        value={saved}
        maxValue={price}
        aria-label={title}
        label="Zebrano"
        showValueLabel
        size="sm"
        className="my-2"
      />
      <div className="text-xl my-4 flex items-center justify-between">
        <span>{formatter.format(saved)}</span>
        <span>/</span>
        <span>{formatter.format(price)}</span>
      </div>
      {description && <p className="text-sm mt-4">{description}</p>}
    </div>
  );
}
