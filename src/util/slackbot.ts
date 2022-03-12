import axios from "axios";
import { DateTime } from "luxon";
import { config } from "../configures";

const send = async (
  message: string,
  method: string,
  path: string,
  ip: string,
) => {
  if (config.app.slackBot?.enable) {
    try {
      const response = await axios.post(
        "https://slack.com/api/chat.postMessage",
        {
          channel: `#${config.app.slackBot.channel}`,
          text: `[${DateTime.now()
            .setZone("UTC+9")
            .toFormat("yyyy-LL-dd / HH:MM:ss", {
              locale: "ko-KR",
            })}] ${message} (ip: ${ip}, from: [${method}] ${path})`,
        },
        {
          headers: {
            Authorization: `Bearer ${config.app.slackBot.token}`,
            "Content-Type": "application/json; charset=utf-8",
          },
        },
      );
      console.info(response.data);
    } catch (e) {
      console.error(e);
    }
  }
};

export const SlackBot = {
  send,
};
