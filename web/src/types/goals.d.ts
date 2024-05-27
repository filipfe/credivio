type Goal = {
  id: string;
  title: string;
  description?: string;
  price: number;
  saved: number;
  currency: string;
  is_priority?: boolean;
  deadline?: string;
};

type ActiveGoal = {
  id: string;
  title: string;
  deadline: string;
  shortfall: number;
  currency: string;
  days_left: number;
};

type GoalRecord = Omit<Goal, "id" | "saved" | "price"> & {
  price: string;
};
