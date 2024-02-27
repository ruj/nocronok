import { type InteractionResponse, hyperlink } from 'discord.js'

import { type ISteamTradesFindUser, type ISteamFindUser } from '@interfaces'
import type Nocronok from '@structures/base/Nocronok'
import { Command, type Context, Embed } from '@structures/command'
import { blank } from '@utils'
import { SteamThirdPartyServiceHttp } from '@utils/Constants'
import SteamUtils from '@utils/SteamUtils'

export default abstract class SteamUser extends Command {
  constructor (client: Nocronok) {
    super(client, { name: 'user', parentName: 'steam' })
  }

  public async execute ({
    interaction,
    polyglot
  }: Context): Promise<InteractionResponse<boolean>> {
    const user: ISteamFindUser & { steamTrades?: ISteamTradesFindUser } =
      await SteamUtils.findUser(interaction.options.getString('user')!)

    user.steamTrades = await SteamUtils.findSteamTradesUserById(user.steamId64)

    const embed = new Embed()

    if (user.realname) {
      embed.setDescription(user.realname)
    }

    embed
      .setAuthor({
        name: user.name,
        url: SteamUtils.buildUserProfileLink(user.steamId64)
      })
      .setThumbnail(user.avatarUrl.full)
      .addFields([
        {
          name: polyglot.t('commands.steam.user.details'),
          value: [
            `${polyglot.t('commands.steam.user.level')}: ${user.level}`,
            `${polyglot.t('commands.steam.user.status')}: ${user.status}`,
            `${polyglot.t('commands.steam.user.privacy')}: ${user.privacy}`
          ].join('\n'),
          inline: true
        },
        {
          name: polyglot.t('commands.steam.user.limitations'),
          value: [
            `${polyglot.t('commands.steam.user.vac')}: ${polyglot.yn(
              user.limitations.vac
            )}`,
            `${polyglot.t('commands.steam.user.trade_ban')}: ${polyglot.yn(
              user.limitations.tradeBan
            )}`,
            `${polyglot.t('commands.steam.user.limited')}: ${polyglot.yn(
              user.limitations.limited
            )}`,
            `${polyglot.t('commands.steam.user.community_ban')}: ${polyglot.yn(
              user.limitations.communityBan
            )}`
          ].join('\n'),
          inline: true
        },
        {
          name: 'SteamTrades',
          value: [
            `${polyglot.t('commands.steam.user.steam_trades.reputation')}`,
            `- ${polyglot.t('commands.steam.user.steam_trades.positive')}: ${user.steamTrades.reputation.positive}`,
            `- ${polyglot.t('commands.steam.user.steam_trades.negative')}: ${user.steamTrades.reputation.negative}`,
            `${polyglot.t('commands.steam.user.steam_trades.trades')}: ${user.steamTrades.trades ? hyperlink(user.steamTrades.trades.toString(), `${SteamThirdPartyServiceHttp.STEAM_TRADES}/trades/search?user=${user.steamId64}`) : user.steamTrades.trades}`
          ].join('\n'),
          inline: true
        },
        {
          name: blank(),
          value: [
            `Steam 3ID: ${user.steam3Id}`,
            `Steam ID32: ${user.steamId32}`,
            `Steam ID64: ${user.steamId64}`,
            `${polyglot.t('commands.steam.user.profile_url')}: ${
              user.customUrl
                ? hyperlink(
                    user.customUrl,
                    SteamUtils.buildUserProfileLink(user.customUrl)
                  )
                : polyglot.t('commons.none')
            }`,
            `${polyglot.t(
              'commands.steam.user.profile_permalink'
            )}: ${hyperlink(
              user.steamId64,
              SteamUtils.buildUserProfileLink(user.steamId64)
            )}`
          ].join('\n')
        },
        {
          name: blank(),
          value: [
            hyperlink(
              'SteamRep',
              SteamUtils.buildSteamRepProfileLink(user.steamId64)
            ),
            hyperlink(
              'SteamTrades',
              SteamUtils.buildSteamTradesProfileLink(user.steamId64)
            ),
            hyperlink(
              'SteamLadder',
              SteamUtils.buildSteamLadderProfileLink(user.steamId64)
            )
          ].join(' | ')
        }
      ])

    if (user.memberSince) {
      embed.setFooter({ text: new Date(user.memberSince).toString() })
    }

    return await interaction.reply({ embeds: [embed] })
  }
}
