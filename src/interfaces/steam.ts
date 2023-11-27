export interface ISteamPlayerBan {
  steamId: string
  communityBanned: boolean
  economyBan: string
  vacBanned: boolean
  numberOfVacBans: number
  numberOfGameBans: number
  daysSinceLastBan: number
}
