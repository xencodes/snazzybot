import * as dotenv from "dotenv";
import { Context, Bot } from "grammy";

import chatbot from "./chatbot";
import common from "./common";
import modules from "./modules";

dotenv.config();

const { BOT_TOKEN } = process.env;
const bot = new Bot(BOT_TOKEN);

modules.map((module) => {
  console.log(`Loading module: ${module.name}`);
  bot.hears(module.match, (ctx) => {
    let params = "";
    params = ctx.match[1];

    module.handler(ctx as Context, params);
  });
});

process.on("unhandledRejection", (err) => {
  // todo: setup error loggin
});

bot.use(common);
bot.use(chatbot);

bot.start();
