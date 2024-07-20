import { LucideIcon } from "lucide-react";

type Props = {
  title: string;
  Icon: LucideIcon;
};

export default function TabTitle({ title, Icon }: Props) {
  return (
    <div className="flex items-center gap-2">
      <Icon size={16} strokeOpacity={0.8} />
      <span>{title}</span>
    </div>
  );
}
