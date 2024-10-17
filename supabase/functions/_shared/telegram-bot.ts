import { Bot, Context, session, SessionFlavor } from "grammy";
import { I18n, I18nFlavor } from "grammy:i18n";
import { freeStorage } from "grammy:storage";
import supabase from "../telegram-bot/supabase.ts";
import locales from "./locales/index.ts";
import toFluentFormat from "./utils/to-fluent-format.ts";

export type SessionData = {
  lastPayments: string[];
  __language_code?: string;
};

export type BotContext = Context & SessionFlavor<SessionData> & I18nFlavor;

const TELEGRAM_BOT_TOKEN = Deno.env.get("TELEGRAM_BOT_TOKEN");

if (!TELEGRAM_BOT_TOKEN) {
  throw new Error(
    "Environment variables missing: TELEGRAM_BOT_TOKEN",
  );
}

const i18n = new I18n<BotContext>({
  defaultLocale: "en",
  localeNegotiator: async (ctx) => {
    const { data, error } = await supabase
      .from("profiles")
      .select(
        "settings(language)",
      )
      .eq("telegram_id", ctx.from?.id)
      .returns<Profile[]>()
      .single();
    if (error) {
      return ctx.from?.language_code ?? "en";
    }
    return data.settings.language;
  },
});

Object.entries(locales).forEach(([locale, content]) => {
  const source = toFluentFormat(content);
  i18n.loadLocaleSync(locale, {
    source,
  });
});

const bot = new Bot<BotContext>(TELEGRAM_BOT_TOKEN);

bot.use(
  session({
    initial: () => ({ lastPayments: [] } as SessionData),
    getSessionKey: (ctx) => ctx.from?.id.toString(),
    storage: freeStorage<SessionData>(bot.token),
  }),
);

bot.use(i18n);

export default bot;
