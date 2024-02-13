import ApiWrapper from '@structures/ApiWrapper'
import type Nocronok from '@structures/base/Nocronok'
import Loader from '@structures/Loader'

export default class ApiLoader extends Loader {
  constructor (client: Nocronok) {
    super(client)
  }

  public load () {
    return this.loadFiles('apis')
  }

  public async loadFile (Api: any) {
    const api = new Api()

    this.addApi(api)
  }

  private async addApi (api: ApiWrapper) {
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
      this.client.apis[api.name] = await api.load()

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
