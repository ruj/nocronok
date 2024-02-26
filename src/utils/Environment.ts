export default class Environment {
  public static isProd (): boolean {
    return process.env.NODE_ENV?.toUpperCase() === 'PRODUCTION'
  }

  public static isDev (): boolean {
    const nodeEnv = process.env.NODE_ENV?.toUpperCase()
    return nodeEnv === 'DEVELOPMENT' || nodeEnv === undefined
  }

  public static getNodeEnv (): string | undefined {
    return process.env.NODE_ENV
  }
}
