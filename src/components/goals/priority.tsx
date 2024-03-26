import Block from "../ui/block";
import RadialChart from "../ui/charts/radial-chart";

export default function Priority({ saved, price }: Goal) {
  return (
    <Block title="Priorytet">
      {/* <div className="grid grid-cols-2 flex-1"> */}
      {/* <div></div> */}
      <div className="relative flex-1">
        <div className="absolute inset-0 h-full w-full flex items-center justify-center">
          <RadialChart data={[{ value: ((saved || 0) / price) * 100 }]} />
        </div>
      </div>
      {/* </div> */}
    </Block>
  );
}
