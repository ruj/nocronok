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
      !api.envVars?.every((variable) => {
        if (!process.env[variable]) {
          this.logger.warn(
            { labels: ['ApiLoader', 'addApi()'] },
            `${api.name} failed to load - Required environment variable "${variable}" is not set.`
          )
        }

        return !!process.env[variable]
      })
    ) {
      return false
    }

    this.client.apis[api.name] = await api.load()

    return true
  }
}
