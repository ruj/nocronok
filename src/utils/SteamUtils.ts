import { load } from 'cheerio'
import SteamID from 'steamid'
import { parseStringPromise } from 'xml2js'

import { ESteamProfilePrivacyStates, ESteamThirdPartyServices } from '@enums'
import { type ISteamTradesFindUser, type ISteamFindUser } from '@interfaces'

import { SteamHttp, SteamThirdPartyServicesHttp } from './Constants'
import { GET } from './http'

export enum EIdentifierFormat {
  SHORT = 'SHORT',
  LONG = 'LONG'
}

export default class SteamUtils {
  public static buildUserProfileLink (user: string): string {
    return `${SteamHttp.COMMUNITY}/${SteamUtils.hydrolyzeProfileIdentifier(user, EIdentifierFormat.LONG)}`
  }

  public static buildSteamRepProfileLink (userId: string): string {
    return SteamUtils.generateThirdPartyServicePermalink(
      ESteamThirdPartyServices.STEAM_REP,
      userId
    ) as string
  }

  public static buildSteamTradesProfileLink (userId: string): string {
    return SteamUtils.generateThirdPartyServicePermalink(
      ESteamThirdPartyServices.STEAM_TRADES,
      userId
    ) as string
  }

  public static buildSteamLadderProfileLink (userId: string): string {
    return SteamUtils.generateThirdPartyServicePermalink(
      ESteamThirdPartyServices.STEAM_LADDER,
      userId
    ) as string
  }

  public static async findUser (user: string): Promise<ISteamFindUser> {
    const profileUrl = [
      SteamHttp.COMMUNITY,
      SteamUtils.hydrolyzeProfileIdentifier(user, EIdentifierFormat.LONG)
    ].join('/')

    const { profile } = await GET(profileUrl + '?xml=1').then(
      async (body) =>
        await parseStringPromise(body as string, {
          explicitArray: false,
          trim: true
        })
    )

    if (!profile) {
      throw new Error('The specified profile could not be found')
    }

    const steamId = new SteamID(profile.steamID64 as string)
    const htmlProfile = await GET(profileUrl).then((body) => {
      const $ = load(body as string)

      return {
        private: !!$('.profile_private_info').text().trim(),
        level: +$('.friendPlayerLevelNum').first().text() || null
      }
    })

    const data = {
      steam3Id: steamId.getSteam3RenderedID(),
      steamId32: steamId.getSteam2RenderedID(),
      steamId64: steamId.getSteamID64(),
      customUrl: profile.customURL ?? null,
      name: profile.steamID,
      realname: profile.realname ?? null,
      avatarUrl: {
        small: profile.avatarIcon,
        medium: profile.avatarMedium,
        full: profile.avatarFull
      },
      level: htmlProfile.level ?? 0,
      location: profile.location ?? null,
      status: profile.stateMessage.replace(/<br\/>.*/, ''),
      privacy: SteamUtils.formatPrivacyState(profile.privacyState as string)!,
      limitations: {
        vac: !!+profile.vacBanned,
        tradeBan: profile.tradeBanState !== 'None',
        limited: !!+profile.isLimitedAccount,
        communityBan: !htmlProfile.private && !htmlProfile.level
      },
      memberSince: profile.memberSince || null
    }

    return data
  }

  public static async findSteamTradesUserById (
    userId: string
  ): Promise<ISteamTradesFindUser> {
    const profileUrl = [
      `${SteamThirdPartyServicesHttp.STEAM_TRADES}/user`,
      SteamUtils.hydrolyzeProfileIdentifier(userId, EIdentifierFormat.SHORT)
    ].join('/')

    return await GET(profileUrl).then((body) => {
      const $ = load(body as string)
      const [registered, lastOnline, trades] = $('.sidebar > .sidebar_table')
        .last()
        .find('span[data-timestamp], a')
        .map((_, element) =>
          $(element).is('span')
            ? $(element).data('timestamp')
            : $(element).text()
        )
        .get()

      return {
        reputation: {
          positive: +$('.increment_positive_review_count').first().text(),
          negative: +$('.increment_negative_review_count').first().text()
        },
        registered: registered !== '0' ? (registered as number) : null,
        lastOnline: ((lastOnline && +lastOnline) as number) || null,
        trades: ((trades && +trades) as number) ?? 0
      }
    })
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

  public static communitySubdirectoryRegex (
    subdirectory: string | string[]
  ): RegExp {
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
  ): string | false {
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
        SteamThirdPartyServicesHttp[thirdPartyServiceName]
      }/${pathPrefix!}/${userId.toString()}`
    )
  }

  public static formatPrivacyState (state: string): string | undefined {
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
