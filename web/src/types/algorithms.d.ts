type _Event = {
  type: "increase" | "decrease";
  amount: number;
  unit: "percentage" | "fixed";
};

type _Algorithm = {
  title: string;
  events: Event[];
};
