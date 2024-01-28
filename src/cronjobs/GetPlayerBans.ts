import { userMention } from 'discord.js'

import { ESteamPlayerBan } from '@enums'
import { ICronJobContext, ISteamPlayerBan } from '@interfaces'
import { Embed } from '@structures/command'
import Cron from '@structures/Cron'
import Webhook from '@structures/Webhook'
import { blank, camelize } from '@utils'
import Mapper from '@utils/Mapper'
import SteamUtils from '@utils/SteamUtils'

export default abstract class GetPlayerBans extends Cron {
  constructor () {
    super({ cronTime: '0 * * * *' })
  }

  public onTick ({ client, logger }: ICronJobContext) {
    return async () => {
      try {
        const banInterval = 1e3
        const playerInterval = 2.5 * 1e3

        const updateSteamPlayerBan = async (playerId: string, data: any) => {
          try {
            await client.prisma.steamPlayerBan.update({
              where: { id: playerId },
              data
            })

            logger.info({
              labels: ['CronJobs', 'GetPlayerBans', 'updateSteamPlayerBan()']
            })
          } catch (error) {
            if (error instanceof Error) {
              logger.error(
                {
                  labels: [
                    'CronJobs',
                    'GetPlayerBans',
                    'updateSteamPlayerBan()'
                  ]
                },
                error.message
              )
            }
          }
        }

        const playerBansFromDatabase =
          await client.prisma.steamPlayerBan.findMany({
            where: { track: true },
            include: { user: true }
          })

        const { players: playerBansFromSteamApi } = camelize(
          await client.apis.steam.getPlayerBans(
            playerBansFromDatabase.map((playerBan) => playerBan.id)
          )
        ) as { players: ISteamPlayerBan[] }

        if (!playerBansFromSteamApi.length) {
          logger.debug(
            { labels: ['CronJobs', 'GetPlayerBans'] },
            `No new players punished (${playerBansFromDatabase.length})`
          )

          return false
        }

        playerBansFromSteamApi
          .map((playerBanFromSteamApi) => {
            const bans: Mapper<ESteamPlayerBan, boolean> = new Mapper()
            const playerBanFromDatabase = playerBansFromDatabase.find(
              (playerBanFromDatabase) =>
                playerBanFromDatabase.id === playerBanFromSteamApi.steamId
            )

            if (
              playerBanFromSteamApi.communityBanned &&
              !playerBanFromDatabase?.community_ban
            ) {
              bans.set(ESteamPlayerBan.COMMUNITY_BAN, true)
            } else if (
              !playerBanFromSteamApi.communityBanned &&
              playerBanFromDatabase?.community_ban
            ) {
              bans.set(ESteamPlayerBan.COMMUNITY_UNBAN, true)
            }

            if (
              playerBanFromSteamApi.economyBan.toUpperCase() === 'BANNED' &&
              !playerBanFromDatabase?.trade_ban
            ) {
              bans.set(ESteamPlayerBan.TRADE_BAN, true)
            }

            if (playerBanFromSteamApi.daysSinceLastBan === 0) {
              if (
                (playerBanFromSteamApi.vacBanned &&
                  !playerBanFromDatabase?.vac_ban) ||
                playerBanFromSteamApi.numberOfGameBans >
                  playerBanFromDatabase?.number_of_vac_bans!
              ) {
                bans.set(ESteamPlayerBan.VAC_BAN, true)
              }

              if (
                (playerBanFromSteamApi.numberOfGameBans > 0 &&
                  !playerBanFromDatabase?.game_ban) ||
                playerBanFromSteamApi.numberOfGameBans >
                  playerBanFromDatabase?.number_of_game_bans!
              ) {
                bans.set(ESteamPlayerBan.GAME_BAN, true)
              }
            }

            return {
              id: playerBanFromDatabase?.id!,
              note: playerBanFromDatabase?.note as string | null,
              bans,
              addedBy: camelize(playerBanFromDatabase?.user!),
              addedAt: playerBanFromDatabase?.added_at
            }
          })
          .filter((player) => player.bans.size)
          .forEach((player, playerIndex) => {
            setTimeout(
              async () => {
                const profile = await SteamUtils.findUser(player.id)
                const addedBy = userMention(player.addedBy.id)
                const data: { [key: string]: any } = {}

                if (player.bans.has(ESteamPlayerBan.COMMUNITY_BAN)) {
                  data.community_ban = player.bans.get(
                    ESteamPlayerBan.COMMUNITY_BAN
                  )
                }

                if (player.bans.has(ESteamPlayerBan.COMMUNITY_UNBAN)) {
                  data.community_ban = !player.bans.get(
                    ESteamPlayerBan.COMMUNITY_UNBAN
                  )
                }

                if (player.bans.has(ESteamPlayerBan.TRADE_BAN)) {
                  data.trade_ban = player.bans.get(ESteamPlayerBan.TRADE_BAN)
                }

                if (player.bans.has(ESteamPlayerBan.VAC_BAN)) {
                  data.vac_ban = player.bans.get(ESteamPlayerBan.VAC_BAN)
                  data.number_of_vac_bans = { increment: 1 }
                }

                if (player.bans.has(ESteamPlayerBan.GAME_BAN)) {
                  data.game_ban = player.bans.get(ESteamPlayerBan.GAME_BAN)
                  data.number_of_game_bans = { increment: 1 }
                }

                updateSteamPlayerBan(player.id, data)

                player.bans.array().forEach(([ban], banIndex, arrayBans) => {
                  setTimeout(() => {
                    const webhook = new Webhook()
                    const embed = new Embed()

                    if (player.note) {
                      embed.setDescription(player.note)
                    }

                    embed
                      .setAuthor({
                        name: profile.name,
                        url: SteamUtils.buildUserProfileLink(player.id)
                      })
                      .setThumbnail(profile.avatar_url.full)
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

                    webhook
                      .send({
                        content: addedBy,
                        embeds: [embed]
                      })
                      .then(() =>
                        logger.info(
                          {
                            labels: ['CronJobs', 'GetPlayerBans', 'webhook']
                          },
                          `${profile.steam_id64} "${profile.name}" -- ${ban} (${
                            banIndex + 1
                          }/${arrayBans.length})`
                        )
                      )
                  }, banIndex * banInterval)
                })
              },
              playerIndex * player.bans.size * banInterval +
                playerIndex * playerInterval
            )
          })
      } catch (error) {}
    }
  }
}
