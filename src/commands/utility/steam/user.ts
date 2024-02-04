import { hyperlink } from 'discord.js'

import type Nocronok from '@structures/base/Nocronok'
import { Command, Context, Embed } from '@structures/command'
import { blank } from '@utils'
import SteamUtils from '@utils/SteamUtils'

export default abstract class SteamUser extends Command {
  constructor (client: Nocronok) {
    super(client, { name: 'user', parentName: 'steam' })
  }

  public async execute ({ interaction, polyglot }: Context) {
    const user = await SteamUtils.findUser(
      interaction.options.getString('user')!
    )

    const embed = new Embed()

    if (user.realname) {
      embed.setDescription(user.realname)
    }

    embed
      .setAuthor({
        name: user.name,
        url: SteamUtils.buildUserProfileLink(user.steam_id64)
      })
      .setThumbnail(user.avatar_url.full)
      .addFields([
        {
          name: blank(),
          value: [
            `${polyglot.t('commands.steam.user.level')}: ${user.level}`,
            `${polyglot.t('commands.steam.user.status')}: ${user.status}`,
            `${polyglot.t('commands.steam.user.privacy')}: ${user.privacy}`
          ].join('\n'),
          inline: true
        },
        {
          name: blank(),
          value: [
            `${polyglot.t('commands.steam.user.vac')}: ${polyglot.yn(
              user.limitations.vac
            )}`,
            `${polyglot.t('commands.steam.user.trade_ban')}: ${polyglot.yn(
              user.limitations.trade_ban
            )}`,
            `${polyglot.t('commands.steam.user.limited')}: ${polyglot.yn(
              user.limitations.limited
            )}`,
            `${polyglot.t('commands.steam.user.community_ban')}: ${polyglot.yn(
              user.limitations.community_ban
            )}`
          ].join('\n'),
          inline: true
        },
        {
          name: blank(),
          value: [
            `Steam 3ID: ${user.steam_3id}`,
            `Steam ID32: ${user.steam_id32}`,
            `Steam ID64: ${user.steam_id64}`,
            `${polyglot.t('commands.steam.user.profile_url')}: ${
              user.custom_url
                ? hyperlink(
                    user.custom_url,
                    SteamUtils.buildUserProfileLink(user.custom_url)
                  )
                : polyglot.t('commons.none')
            }`,
            `${polyglot.t(
              'commands.steam.user.profile_permalink'
            )}: ${hyperlink(
              user.steam_id64,
              SteamUtils.buildUserProfileLink(user.steam_id64)
            )}`
          ].join('\n')
        },
        {
          name: blank(),
          value: [
            hyperlink(
              'SteamRep',
              SteamUtils.buildSteamRepProfileLink(user.steam_id64)
            ),
            hyperlink(
              'SteamTrades',
              SteamUtils.buildSteamTradesProfileLink(user.steam_id64)
            )
          ].join(' | ')
        }!
      ])
      .setFooter({ text: new Date(user.member_since).toString() })

    return await interaction.reply({ embeds: [embed] })
  }
}
