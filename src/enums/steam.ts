export enum ESteamProfilePrivacyState {
  public = 'Public',
  friendsonly = 'Friends Only',
  private = 'Private'
}

export enum ESteamWebApiInterface {
  SteamUser = 'ISteamUser'
}

export enum ESteamWebApiMethod {
  GetPlayerBans = 'GetPlayerBans'
}

export enum ESteamPlayerBan {
  COMMUNITY_BAN = 'COMMUNITY_BAN',
  COMMUNITY_UNBAN = 'COMMUNITY_UNBAN',
  TRADE_BAN = 'TRADE_BAN',
  VAC_BAN = 'VAC_BAN',
  GAME_BAN = 'GAME_BAN'
}
