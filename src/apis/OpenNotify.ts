import ApiWrapper from '@structures/ApiWrapper'
import { GET } from '@utils/http'

export default class OpenNotify extends ApiWrapper {
  constructor () {
    super({ name: 'openNotify', baseUrl: 'http://api.open-notify.org' })
  }

  public iss () {
    return this.request('iss-now')
  }

  public astros () {
    return this.request('astros')
  }

  private request (endpoint: string) {
    return GET(`${this.baseUrl}/${endpoint}`)
  }
}
