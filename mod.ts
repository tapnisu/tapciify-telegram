import { Bot, Context } from "grammy";
import { FileFlavor, hydrateFiles } from "grammy_files";
import { ParseModeFlavor, code, fmt, hydrateReply } from "grammy_parse_mode";
import { limit } from "grammy_ratelimiter";
import { env } from "./env.ts";
import { TapciifyApi } from "./lib/api.ts";

type MyContext = ParseModeFlavor<FileFlavor<Context>>;

const bot = new Bot<MyContext>(env.TOKEN, {});
const api = new TapciifyApi();

bot.api.config.use(hydrateFiles(bot.token));
bot.use(limit());
bot.use(hydrateReply);

const converter = async (ctx: Pick<MyContext, "getFile" | "replyFmt">) => {
  const file = await ctx.getFile();

  const req = await fetch(file.getUrl());
  const blob = await req.blob();
  const res = await api.convert(blob, 64, undefined, undefined, 0.45);
  const asciiArt = res.data[0].asciiArt;

  ctx.replyFmt(fmt`${code(asciiArt)}`);
};

bot.command("start", (ctx) =>
  ctx.reply("Send me a photo, and I will convert it to ASCII")
);

bot.on("message:photo", converter);
bot.on("message:file", converter);

if (env.MODE == "development") bot.start();

export default bot;
