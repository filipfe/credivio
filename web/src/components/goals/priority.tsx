"use client";

import Block from "../ui/block";
import Empty from "../ui/empty";

export default function Priority({ goal }: { goal?: Goal }) {
  const sum = goal
    ? goal.payments.reduce((prev, { amount }) => prev + amount, 0)
    : 0;

  return (
    <Block title="Priorytet">
      {goal ? (
        <div className="flex-1"></div>
      ) : (
        <Empty title="Brak priorytetu" />
      )}
    </Block>
  );
}
