import { ESteamWebApiInterface, ESteamWebApiMethod } from '@enums'
import ApiWrapper from '@structures/ApiWrapper'
import { GET } from '@utils/http'

export default class Steam extends ApiWrapper {
  constructor () {
    super({
      name: 'steam',
      baseUrl: 'https://api.steampowered.com',
      envVars: ['STEAM_API_KEY']
    })
  }

  public getPlayerBans (steamdIds: string | string[]) {
    return this.request(
      ESteamWebApiInterface.SteamUser,
      ESteamWebApiMethod.GetPlayerBans,
      1,
      { steamids: Array.isArray(steamdIds) ? steamdIds.join(',') : steamdIds }
    )
  }

  private request (
    iface: ESteamWebApiInterface,
    method: ESteamWebApiMethod,
    version: number,
    params: { [key: string]: any }
  ) {
    return GET(
      `${this.baseUrl}/${iface}/${method}/v${version}?${this.buildQuery({
        key: process.env.STEAM_API_KEY,
        ...params
      })}`
    )
  }
}
