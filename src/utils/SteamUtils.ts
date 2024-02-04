import { load } from 'cheerio'
import SteamID from 'steamid'
import { parseStringPromise } from 'xml2js'

import { ESteamThirdPartyServices, ESteamProfilePrivacyState } from '@enums'

import { SteamHttp } from './Constants'
import { GET } from './http'

export default class SteamUtils {
  public static buildUserProfileLink (user: string) {
    return `${SteamHttp.COMMUNITY}/${SteamUtils.hydrolyzeProfileUrl(user)}`
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
      SteamUtils.hydrolyzeProfileUrl(user)
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
      level: htmlProfile.level,
      location: profile.location || null,
      status: profile.stateMessage.replace(/<br\/>.*/, ''),
      privacy:
        ESteamProfilePrivacyState[
          profile.privacyState as keyof typeof ESteamProfilePrivacyState
        ],
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

  public static hydrolyzeProfileUrl (value: string) {
    const match = value.match(
      SteamUtils.communitySubdirectoryRegex('id|profiles')
    )
    const user = Array.isArray(match) ? match[1] : value

    if (
      user.startsWith('STEAM_') ||
      user.startsWith('765') ||
      user.startsWith('[U:')
    ) {
      const steamId = new SteamID(user)

      return steamId.isValid() ? `profiles/${steamId.toString()}` : null
    } else {
      return !user.startsWith('id/') && !user.startsWith('profiles/')
        ? `id/${user}`
        : user
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

  private static generateThirdPartyServicePermalink (
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
        SteamHttp.THIRD_PARTY_SERVICE[thirdPartyServiceName]
      }/${pathPrefix!}/${userId.toString()}`
    )
  }
}
