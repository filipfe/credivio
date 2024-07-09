type Goal = {
  id: string;
  title: string;
  description?: string;
  price: number;
  currency: string;
  is_priority?: boolean;
  deadline?: string;
  payments: GoalPayment[];
};

type GoalPayment = {
  goal_id: string;
  amount: number;
  date: string;
};
