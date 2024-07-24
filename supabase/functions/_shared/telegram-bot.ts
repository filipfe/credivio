import { Bot, Context, SessionFlavor } from "grammy";

export type SessionData = {
  lastPayments: string[];
};

export type BotContext = Context & SessionFlavor<SessionData>;

const TELEGRAM_BOT_TOKEN = Deno.env.get("TELEGRAM_BOT_TOKEN");

if (!TELEGRAM_BOT_TOKEN) {
  throw new Error(
    "Environment variables missing: TELEGRAM_BOT_TOKEN",
  );
}

const bot = new Bot<BotContext>(TELEGRAM_BOT_TOKEN);

export default bot;
