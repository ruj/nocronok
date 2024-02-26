import type ApiWrapper from '@structures/ApiWrapper'
import type Nocronok from '@structures/base/Nocronok'
import Loader from '@structures/Loader'

export default class ApiLoader extends Loader {
  constructor (client: Nocronok) {
    super(client)
  }

  public async load (): Promise<void> {
    await this.loadFiles('apis')
  }

  public async loadFile (Api: any): Promise<void> {
    const api: ApiWrapper = new Api()

    void this.addApi(api)
  }

  private async addApi (api: ApiWrapper): Promise<boolean> {
    if (
      api.envVars &&
      !api.envVars.every((variable) => {
        if (!process.env[variable]) {
          this.logger.warn(
            { labels: ['ApiLoader', 'addApi()'] },
            `${api.name} failed to load - Required environment variable "${variable}" is not set.`
          )

          return false
        }

        return true
      })
    ) {
      return false
    }

    try {
      this.client.apis[api.name] = await Promise.resolve(api.load())

      return true
    } catch (error: unknown) {
      if (error instanceof Error) {
        this.logger.error(
          { labels: ['ApiLoader', 'addApi()'] },
          `${api.name} failed to load - ${error.message}`
        )
      }

      return false
    }
  }
}
