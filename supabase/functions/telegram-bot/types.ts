import { Context, SessionFlavor } from "grammy";

export type SessionData = {
  lastPayments: string[];
};

export type BotContext = Context & SessionFlavor<SessionData>;

export type Profile = {
  id: string;
  first_name: string;
  language_code: string;
  currency: string;
};

export type Command = Record<string, string>;
