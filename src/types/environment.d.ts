declare global {
  namespace NodeJS {
    interface ProcessEnv {
      PORT?: string
      HTTP_PASSWORD?: string
      DISCORD_TOKEN: string
    }
  }
}

export {}
