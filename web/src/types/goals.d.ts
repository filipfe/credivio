type PriorityGoalPayment = {
  date: string;
  amount: number;
};

type PriorityGoal = {
  title: string;
  price: number;
  currency: string;
  total_paid: number;
  payments: PriorityGoalPayment[];
};

type Goal = {
  id: string;
  title: string;
  price: number;
  currency: string;
  deadline?: string;
  total_paid: number;
  is_priority: boolean;
};

type GoalPayment = {
  date: string;
  payments: {
    goal_id: string;
    currency: string;
    amount: number;
  }[];
};
