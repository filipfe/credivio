import { Menu } from "grammy:menu";
import { BotContext } from "./types.ts";

const menu = new Menu<BotContext>("operations-menu")
  .text("Przychód", async (ctx) => {
    ctx.session.type = "income";
    await ctx.reply(
      `Jasne! 
      Podaj tytuł i cenę`,
    );
  })
  .text("Wydatek", async (ctx) => {
    ctx.session.type = "expense";
    console.log({ type: ctx.session.type });
    await ctx.reply(
      `Jasne! 
Podaj tytuł i cenę`,
    );
  });

export default menu;
