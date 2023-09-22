export type Config = {
  web3StorageToken: string
  databaseUrl: string
  tenorApiKey: string
}

function getConfig(): Config {
  const { WEB3_STORAGE_TOKEN, DATABASE_URL, TENOR_API_KEY } = process.env
  if (!WEB3_STORAGE_TOKEN) {
    throw new Error(
      "Missing web3 storage token. You can get one for free at https://web3.storage",
    )
  }
  if (!DATABASE_URL) {
    throw new Error(
      "Missing DATABASE_URL environment variable. Make sure your replit is configured with a Postgres database",
    )
  }

  if (!TENOR_API_KEY) {
    throw new Error(
      "Missing TENOR_API_KEY environment variable. You can get one from here: https://developers.google.com/tenor/guides/quickstart",
    )
  }

  return {
    web3StorageToken: WEB3_STORAGE_TOKEN,
    databaseUrl: DATABASE_URL,
    tenorApiKey: TENOR_API_KEY,
  }
}

const config = getConfig()

export default config
