//@ts-ignore
import qrcode from "qrcode-terminal"

export function printWalletQr(address: string) {
  qrcode.generate(`https://converse.xyz/dm/${address}`)
}
