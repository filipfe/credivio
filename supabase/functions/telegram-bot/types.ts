import { Context, SessionFlavor } from "grammy";

export type SessionData = {
  type?: "income" | "expense";
  lastPayments: Payment[];
};

export type BotContext = Context & SessionFlavor<SessionData>;
