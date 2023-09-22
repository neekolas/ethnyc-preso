import { newBotConfig, run } from "@xmtp/bot-kit-pro"
import config from "./config.js"

import {
  AttachmentCodec,
  RemoteAttachmentCodec,
} from "@xmtp/content-type-remote-attachment"
import gifSearch from "./gifSearch.js"
import { printWalletQr } from "./utils.js"

async function start() {
  const botConfig = newBotConfig(
    "gif",
    {
      xmtpEnv: "production",
      clientOptions: {
        codecs: [new RemoteAttachmentCodec(), new AttachmentCodec()],
      },
    },
    gifSearch,
  )

  const { bots } = await run([botConfig], {
    db: {
      postgresConnectionString: config.databaseUrl,
    },
  })

  for (const bot of bots) {
    console.log(`Bot started: ${bot.config.name} - ${bot.address}`)
    printWalletQr(bot.address)
  }
}

start()
