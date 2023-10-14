declare global {
  namespace NodeJS {
    interface ProcessEnv {
      PORT?: string
      HTTP_PASSWORD?: string
      DEVELOPERS_ID?: string
      DISCORD_TOKEN: string
    }
  }
}

export {}
