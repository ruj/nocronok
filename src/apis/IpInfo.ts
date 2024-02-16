import ApiWrapper from '@structures/ApiWrapper'
import { GET } from '@utils/http'

const { IP_INFO_TOKEN } = process.env

export interface IIpInfoApiResponse {
  ip: string
  hostname: string
  anycast: boolean
  city: string
  region: string
  country: string
  loc: string
  org: string
  postal: string
  timezone: string
}

export default class IpInfo extends ApiWrapper {
  constructor () {
    super({
      name: 'ipInfo',
      baseUrl: 'https://ipinfo.io',
      envVars: ['IP_INFO_TOKEN']
    })
  }

  public find (ip: string) {
    return this.request(ip)
  }

  private request (path: string) {
    return GET<IIpInfoApiResponse>(
      `${this.baseUrl}${
        !path.startsWith('/') ? `/${path}` : path
      }?${this.buildQuery({ token: IP_INFO_TOKEN })}`
    )
  }
}
