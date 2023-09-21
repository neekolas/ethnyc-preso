import { Web3Storage, File } from "web3.storage";
import config from "./config.js";
import {
  Attachment,
  AttachmentCodec,
  RemoteAttachment,
  RemoteAttachmentCodec,
} from "@xmtp/content-type-remote-attachment";
import fetch from "node-fetch";

const web3Storage = new Web3Storage({ token: config.web3StorageToken });

export async function createAttachment(url: string, filename: string) {
  const { fileData, mimeType } = await downloadFile(url);
  const attachment: Attachment = {
    filename,
    mimeType,
    data: fileData,
  };

  const encryptedAttachment = await RemoteAttachmentCodec.encodeEncrypted(
    attachment,
    new AttachmentCodec()
  );

  const upload = new File(
    [encryptedAttachment.payload],
    "XMTPEncryptedContent"
  );
  const cid = await web3Storage.put([upload]);
  const downloadUrl = `https://${cid}.ipfs.w3s.link/XMTPEncryptedContent`;

  const remoteAttachment: RemoteAttachment = {
    // This is the URL string where clients can download the encrypted
    // encoded content
    url: downloadUrl,

    // We hash the encrypted encoded payload and send that along with the
    // remote attachment. On the recipient side, clients can verify that the
    // encrypted encoded payload they've downloaded matches what was uploaded.
    // This is to prevent tampering with the content once it's been uploaded.
    contentDigest: encryptedAttachment.digest,

    // These are the encryption keys that will be used by the recipient to
    // decrypt the remote payload
    salt: encryptedAttachment.salt,
    nonce: encryptedAttachment.nonce,
    secret: encryptedAttachment.secret,

    // For now, all remote attachments MUST be fetchable via HTTPS GET requests.
    // We're investigating IPFS here among other options.
    scheme: "https://",

    // These fields are used by clients to display some information about
    // the remote attachment before it is downloaded and decrypted.
    filename: attachment.filename,
    contentLength: attachment.data.byteLength,
  };
  console.log(remoteAttachment);
  return remoteAttachment;
}

async function downloadFile(url: string) {
  const response = await fetch(url);
  const headers = response.headers;
  const mimeType = headers.get("content-type");
  if (!mimeType) {
    console.log(headers);
    throw new Error("No mimetype from headers");
  }
  const fileData = new Uint8Array(await response.buffer());
  if (!fileData) {
    throw new Error("Could not read file data");
  }
  console.log("Downloaded file", mimeType, fileData);
  return { mimeType, fileData };
}
