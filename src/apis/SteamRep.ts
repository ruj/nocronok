import ApiWrapper from '@structures/ApiWrapper'
import { GET } from '@utils/http'

export interface ISteamRepReputation {
  status: string
  details: string
}

export default class SteamRep extends ApiWrapper {
  constructor () {
    super({ name: 'steamRep', baseUrl: 'https://steamrep.com/api' })
  }

  public async reputation (steamId: string): Promise<ISteamRepReputation> {
    const data = await this.request<{
      steamrep: { reputation: { full: string; summary: string } }
    }>(
      `/beta4/reputation/${steamId}?${this.buildQuery({ json: 1, extended: 1 })}`
    )

    return {
      status: data.steamrep.reputation.summary,
      details: data.steamrep.reputation.full
    }
  }

  private async request<Type> (path: string): Promise<Type> {
    return await GET<Type>(
      `${this.baseUrl}${!path.startsWith('/') ? `/${path}` : path}`
    )
  }
}
