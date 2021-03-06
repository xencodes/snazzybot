import axios from "axios";
import cheerio from "cheerio";
import { Context } from "grammy";
import meta from "./meta";

const Answer = async (ctx: Context, params?: any) => {
  if (!params || ctx.message.reply_to_message?.from?.id == ctx.me.id) return;
  ctx.api.sendChatAction(ctx.chat.id, "typing");

  const text = ctx.message.text;
  let answer = "",
    last = "";

  // remove snazzy if starts
  const q = text.replace(/^snazzy/, "");

  // get result from google
  await axios
    .get(`https://google.com/search?q=${q}&hl=en`, {
      headers: {
        "user-agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.169 Safari/537.36",
        referer: "https://www.google.com/",
      },
    })
    .then(({ data }) => {
      const classes = [
        "kno-rdesc",
        "DjWnwf",
        "Z0LcW",
        "hgKElc",
        "vXQmIe",
        "UQt4rd",
      ];

      const $ = cheerio.load(data);
      const calcAns = $("input[jsname='fPLMtf']");
      for (let _class of classes) {
        let text = $(`.${_class}`).text();
        if (text) {
          if (text.startsWith("Description")) {
            text = text.replace(/^Description/g, "");
          }
          answer = `<b>${text}</b>`;
          break;
        }
      }

      if (!answer) {
        const cals = String(calcAns.val());
        answer = cals === "undefined" ? "" : cals;
      }

      if (answer) {
        // Get selected option from the dropdown
        const unit = $("select[jsname='iNUlwe']");
        unit.find("option").each((i, el) => {
          const isSelected = $(el).attr("selected");
          if (isSelected) {
            last = $(el).text();
          }
        });
      }

      if (!answer) {
        answer = $('div[data-dobid="dfn"]').text();
      }
    })
    .catch((err) => {
      answer = "Not found.";
    });

  ctx.reply(`${answer} ${last}`, {
    parse_mode: "HTML",
    reply_to_message_id: ctx.message.message_id,
  });
};

export default {
  handler: Answer,
  match: /^(snazzy|what's|what is|whats) (.*)/i,
  ...meta,
};
