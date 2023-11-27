import { userMention } from 'discord.js'

import { ESteamPlayerBan } from '@enums'
import { ICronJobContext, ISteamPlayerBan } from '@interfaces'
import { Embed } from '@structures/command'
import Cron from '@structures/Cron'
import Webhook from '@structures/Webhook'
import { blank, camelize } from '@utils'
import SteamUtils from '@utils/SteamUtils'

export default abstract class GetPlayerBans extends Cron {
  constructor () {
    super({ cronTime: '0 * * * *' })
  }

  public onTick ({ client }: ICronJobContext) {
    return async () => {
      const playerBans = await client.prisma.steamPlayerBan.findMany({
        include: { user: true }
      })
      const { players } = camelize(
        await client.apis.steam.getPlayerBans(
          playerBans.map((playerBan) => playerBan.id)
        )
      ) as { players: ISteamPlayerBan[] }

      if (players.length) {
        players
          .map((player) => {
            const bans = []
            const playerBan = playerBans.find(
              (playerBan) => playerBan.id === player.steamId
            )

            if (player.communityBanned && !playerBan?.community_ban) {
              bans.push(ESteamPlayerBan.COMMUNITY_BAN)
            } else if (!player.communityBanned && playerBan?.community_ban) {
              bans.push(ESteamPlayerBan.COMMUNITY_UNBAN)
            }

            if (
              player.economyBan.toUpperCase() === 'BANNED' &&
              !playerBan?.trade_ban
            ) {
              bans.push(ESteamPlayerBan.TRADE_BAN)
            }

            if (player.daysSinceLastBan === 0) {
              if (
                (player.vacBanned && !playerBan?.vac_ban) ||
                player.numberOfVacBans > playerBan?.number_of_vac_bans!
              ) {
                bans.push(ESteamPlayerBan.VAC_BAN)
              }

              if (
                (player.numberOfGameBans > 0 && !playerBan?.game_ban) ||
                player.numberOfGameBans > playerBan?.number_of_game_bans!
              ) {
                bans.push(ESteamPlayerBan.GAME_BAN)
              }
            }

            return {
              steamId: player.steamId,
              bans,
              note: playerBan?.note,
              addedAt: playerBan?.added_at,
              addedBy: playerBan?.user
            }
          })
          .filter(({ bans }) => bans.length)
          .forEach((player, index) => {
            setTimeout(
              async () => {
                const playerProfile = await SteamUtils.findUser(player.steamId)
                const addedBy = userMention(player.addedBy?.id!)

                player.bans.forEach((ban, index) => {
                  setTimeout(() => {
                    const webhook = new Webhook()
                    const embed = new Embed()

                    if (player.note) {
                      embed.setDescription(player.note)
                    }

                    embed
                      .setAuthor({
                        name: playerProfile.name,
                        url: SteamUtils.buildUserProfileLink(player.steamId)
                      })
                      .setThumbnail(playerProfile.avatar_url.full)
                      .addFields([
                        {
                          name: blank(),
                          value: [
                            `Banned by ${ban}`,
                            `Added by ${addedBy}`
                          ].join('\n')
                        }
                      ])
                      .setFooter({ text: new Date(player.addedAt!).toString() })

                    webhook.send({
                      content: addedBy,
                      embeds: [embed]
                    })
                  }, index * 1e3)
                })
              },
              index * player.bans.length * 1e3
            )
          })
      }
    }
  }
}
