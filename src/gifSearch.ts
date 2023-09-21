import { HandlerContext } from "@xmtp/bot-kit-pro";
import { search } from "./tenor.js";
import { ContentTypeRemoteAttachment } from "@xmtp/content-type-remote-attachment";
import { createAttachment } from "./createAttachment.js";

type ConvoState = {};

type BotState = {};

export default async function gifSearch({
  message,
  reply,
}: HandlerContext<ConvoState, BotState>) {
  const searchQuery = message.content;
  console.log(`Searching for ${searchQuery}`);
  const gifUrl = await search(searchQuery);
  if (!gifUrl) {
    console.log("No url found");
    return;
  }
  const attachment = await createAttachment(gifUrl, `${searchQuery}.gif`);

  reply(attachment, { contentType: ContentTypeRemoteAttachment });
}
