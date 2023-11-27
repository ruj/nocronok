declare global {
  namespace NodeJS {
    interface ProcessEnv {
      PORT?: string
      HTTP_PASSWORD?: string
      DEVELOPERS_ID?: string
      DISCORD_TOKEN: string
      DISCORD_DEFAULT_WEBHOOK_ID: string
      DISCORD_DEFAULT_WEBHOOK_TOKEN: string
      STEAM_API_KEY: string
    }
  }
}

export {}
