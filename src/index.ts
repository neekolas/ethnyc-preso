import { newBotConfig, run } from "@xmtp/bot-kit-pro";
import config from "./config.js";
//@ts-ignore
import qrcode from "qrcode-terminal";
import {
  AttachmentCodec,
  RemoteAttachmentCodec,
} from "@xmtp/content-type-remote-attachment";
import gifSearch from "./gifSearch.js";

async function start() {
  const botConfig = newBotConfig(
    "gif",
    {
      xmtpEnv: "production",
      clientOptions: {
        codecs: [new RemoteAttachmentCodec(), new AttachmentCodec()],
      },
    },
    gifSearch
  );

  const { bots } = await run([botConfig], {
    db: {
      postgresConnectionString: `${config.databaseUrl}?sslmode=require`,
    },
  });

  for (const bot of bots) {
    console.log(`Bot started: ${bot.config.name} - ${bot.address}`);
    qrcode.generate(`https://go.cb-w.com/messaging?address=${bot.address}`);
  }
}

start();
