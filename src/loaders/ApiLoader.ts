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

    this.client.apis[api.name] = await api.load()
  }
}
