import { Skeleton, cn } from "@nextui-org/react";
import Block from "../block";
type Props = { className?: string; hideTitle?: boolean };

export default function LineChartLoader({ className, hideTitle }: Props) {
  return (
    <Block
      className={cn("min-h-48 flex flex-col items-center h-full", className)}
    >
      {!hideTitle && <Skeleton className="h-5 rounded-full w-1/6 opacity-60" />}
      <div className="relative flex flex-col justify-between h-full border-b border-content4 border-l p-6 flex-1 w-full">
        <Skeleton className="h-px" />
        <Skeleton className="h-px" />
        <Skeleton className="h-px" />
        <Skeleton className="h-px" />
        <Skeleton className="h-px" />
        <div className="absolute inset-0 w-full h-full flex items-center justify-evenly">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            version="1.1"
            xmlnsXlink="http://www.w3.org/1999/xlink"
            viewBox="0 0 800 400"
            width="100%"
          >
            <path
              d="M0.4484241008758545,272.6457214355469C7.977571968634923,269.0358562978109,178.43347417712212,179.91927294413247,196.86097717285156,178.47532653808594C215.288480168581,177.0313801320394,458.16589413960776,238.55304018656412,481.1658935546875,234.97755432128906C504.16589296976724,231.402068456014,784.7593176269531,90.94318682352701,796.8609619140625,85.2017822265625"
              fill="none"
              strokeWidth="2"
              stroke="#e0e0e0"
              strokeLinecap="round"
              strokeOpacity={0.8}
              strokeDasharray="0 0"
            ></path>
          </svg>
        </div>
      </div>
    </Block>
  );
}
