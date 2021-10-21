import { config } from "../../configures/config";
import axios from "axios";

const send = async (message: string) => {
  if (config.app.slackBot?.enable) {
    try {
      const response = await axios.post(
        "https://slack.com/api/chat.postMessage",
        {
          channel: `#${config.app.slackBot.channel}`,
          text: `[${new Date().toISOString()}] ${message}`,
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
