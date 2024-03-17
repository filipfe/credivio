import Block from "../ui/block";

export default function Timeline({ goals }: { goals: Goal[] }) {
  if (goals.length === 0) return;
  return (
    <Block title="Oś czasu">
      <div className="bg-primary rounded-full h-0.5 flex items-center justify-between px-8 mb-8">
        <div className="bg-primary rounded-full h-2 w-2 flex flex-col items-center relative">
          <div className="absolute -bottom-8">
            <span className="text-primary text-sm font-medium">
              {new Date().toLocaleDateString()}
            </span>
          </div>
        </div>
        {goals.map((goal) => (
          <DayRef {...goal} key={goal.id} />
        ))}
      </div>
    </Block>
  );
}

const DayRef = ({ title, deadline }: Goal) => (
  <div className="bg-primary rounded-full h-2 w-2 flex flex-col items-center relative">
    <div className="absolute -bottom-8">
      <span className="text-primary text-sm font-medium">
        {new Date(deadline).toLocaleDateString()}
      </span>
    </div>
  </div>
);
