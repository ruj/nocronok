export interface ISteamFindUser {
  steam3Id: string
  steamId32: string
  steamId64: string
  customUrl: string | null
  name: string
  realname: string | null
  avatarUrl: {
    small: string
    medium: string
    full: string
  }
  level: number
  location: string | null
  status: string
  privacy: string
  limitations: {
    vac: boolean
    tradeBan: boolean
    limited: boolean
    communityBan: boolean
  }
  memberSince: string | null
}

export interface ISteamTradesReputation {
  positive: number
  negative: number
}

export interface ISteamTradesFindUser {
  reputation: ISteamTradesReputation
  registered: string | number | null
  lastOnline: string | number | null
  trades: number
}
