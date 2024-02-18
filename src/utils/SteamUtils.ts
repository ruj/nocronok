import { load } from 'cheerio'
import SteamID from 'steamid'
import { parseStringPromise } from 'xml2js'

import { ESteamProfilePrivacyStates, ESteamThirdPartyServices } from '@enums'

import { SteamHttp, SteamThirdPartyServiceHttp } from './Constants'
import { GET } from './http'

export enum EIdentifierFormat {
  SHORT = 'SHORT',
  LONG = 'LONG'
}

export default class SteamUtils {
  public static buildUserProfileLink (user: string) {
    return `${SteamHttp.COMMUNITY}/${SteamUtils.hydrolyzeProfileIdentifier(user, EIdentifierFormat.LONG)}`
  }

  public static buildSteamRepProfileLink (userId: string) {
    return SteamUtils.generateThirdPartyServicePermalink(
      ESteamThirdPartyServices.STEAM_REP,
      userId
    ) as string
  }

  public static buildSteamTradesProfileLink (userId: string) {
    return SteamUtils.generateThirdPartyServicePermalink(
      ESteamThirdPartyServices.STEAM_TRADES,
      userId
    ) as string
  }

  public static buildSteamLadderProfileLink (userId: string) {
    return SteamUtils.generateThirdPartyServicePermalink(
      ESteamThirdPartyServices.STEAM_LADDER,
      userId
    ) as string
  }

  public static async findUser (user: string) {
    const profileUrl = [
      SteamHttp.COMMUNITY,
      SteamUtils.hydrolyzeProfileIdentifier(user, EIdentifierFormat.LONG)
    ].join('/')

    const { profile } = await GET(profileUrl + '?xml=1').then((body) =>
      parseStringPromise(body as string, { explicitArray: false, trim: true })
    )

    if (!profile) {
      throw new Error('The specified profile could not be found')
    }

    const steamId = new SteamID(profile.steamID64)
    const htmlProfile = await GET(profileUrl).then((body) => {
      const $ = load(body as string)

      return {
        private: !!$('.profile_private_info').text().trim(),
        level: +$('.friendPlayerLevelNum').first().text() || null
      }
    })

    const data = {
      steam_3id: steamId.getSteam3RenderedID(),
      steam_id32: steamId.getSteam2RenderedID(),
      steam_id64: steamId.getSteamID64(),
      custom_url: profile.customURL || null,
      name: profile.steamID,
      realname: profile.realname || null,
      avatar_url: {
        small: profile.avatarIcon,
        medium: profile.avatarMedium,
        full: profile.avatarFull
      },
      level: htmlProfile.level ?? 0,
      location: profile.location || null,
      status: profile.stateMessage.replace(/<br\/>.*/, ''),
      privacy: SteamUtils.formatPrivacyState(profile.privacyState),
      limitations: {
        vac: !!+profile.vacBanned,
        trade_ban: profile.tradeBanState !== 'None',
        limited: !!+profile.isLimitedAccount,
        community_ban: !htmlProfile.private && !htmlProfile.level
      },
      member_since: profile.memberSince || null
    }

    return data
  }

  public static hydrolyzeProfileIdentifier (
    identifier: string,
    format: EIdentifierFormat
  ): string {
    const match = identifier.match(
      SteamUtils.communitySubdirectoryRegex('id|profiles')
    )

    identifier = Array.isArray(match) ? match[1] : identifier

    let result: string

    if (/^(STEAM_|765|\[U:)/.test(identifier)) {
      const steamId = new SteamID(identifier)

      result = steamId.isValid() ? `profiles/${steamId.toString()}` : identifier
    } else if (!/^(id\/|profiles\/)/.test(identifier)) {
      result = `id/${identifier}`
    } else {
      result = identifier
    }

    switch (format) {
      case EIdentifierFormat.SHORT:
        return result.replace(/^(id|profiles)\//, '')
      case EIdentifierFormat.LONG:
        return result
    }
  }

  public static communitySubdirectoryRegex (subdirectory: string | string[]) {
    if (Array.isArray(subdirectory)) {
      subdirectory = subdirectory.join('|')
    }

    return new RegExp(
      `(?:https?:\\/\\/)?steamcommunity\\.com\\/((?:${subdirectory})\\/[a-zA-Z0-9_-]+)`
    )
  }

  public static generateThirdPartyServicePermalink (
    thirdPartyServiceName: ESteamThirdPartyServices,
    userId: string | SteamID
  ) {
    if (!(userId instanceof SteamID)) {
      userId = new SteamID(userId)
    }

    let pathPrefix: string

    if (thirdPartyServiceName === ESteamThirdPartyServices.STEAM_REP) {
      pathPrefix = 'profiles'
    } else if (
      thirdPartyServiceName === ESteamThirdPartyServices.STEAM_TRADES
    ) {
      pathPrefix = 'user'
    } else if (
      thirdPartyServiceName === ESteamThirdPartyServices.STEAM_LADDER
    ) {
      pathPrefix = 'profile'
    }

    return (
      userId.isValid() &&
      `${
        SteamThirdPartyServiceHttp[thirdPartyServiceName]
      }/${pathPrefix!}/${userId.toString()}`
    )
  }

  public static formatPrivacyState (state: string) {
    state = state.replace(/(\w)(only)/, '$1_$2')

    switch (state.toUpperCase()) {
      case ESteamProfilePrivacyStates.PUBLIC:
        return 'Public'
      case ESteamProfilePrivacyStates.FRIENDS_ONLY:
        return 'Friends Only'
      case ESteamProfilePrivacyStates.PRIVATE:
        return 'Private'
    }
  }
}
