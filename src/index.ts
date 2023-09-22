import { HandlerContext, newBotConfig, run } from "@xmtp/bot-kit-pro"
import config from "./config.js"
//@ts-ignore
import qrcode from "qrcode-terminal"
import {
  AttachmentCodec,
  RemoteAttachmentCodec,
} from "@xmtp/content-type-remote-attachment"
import gifSearch from "./gifSearch.js"

async function start() {
  const gmBot = newBotConfig(
    "gm",
    {
      xmtpEnv: 'production'
    },
    gmBotHandler,
  )
  const gifBot = newBotConfig(
    "gif",
    {
      xmtpEnv: "production",
      clientOptions: {
        codecs: [new RemoteAttachmentCodec(), new AttachmentCodec()],
      },
    },
    gifSearch,
  )

  const { bots } = await run([gmBot], {
    db: {
      postgresConnectionString: config.databaseUrl,
    },
  })

  for (const bot of bots) {
    console.log(`Bot started: ${bot.config.name} - ${bot.address}`)
    qrcode.generate(`https://converse.xyz/dm/${bot.address}`)
  }
}

start()

async function gmBotHandler(ctx: HandlerContext) {
  ctx.reply('gm')
}