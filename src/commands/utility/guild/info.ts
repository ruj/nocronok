import { type InteractionResponse } from 'discord.js'

import type Nocronok from '@structures/base/Nocronok'
import { Command, type Context, Embed } from '@structures/command'
import { blank } from '@utils'

export default abstract class GuildInfo extends Command {
  constructor (client: Nocronok) {
    super(client, { name: 'info', parentName: 'guild' })
  }

  public async execute ({
    interaction,
    guild,
    polyglot
  }: Context): Promise<InteractionResponse<boolean>> {
    const embed = new Embed()

    const emojis = guild?.emojis.cache
    const roles = guild?.roles.cache

    if (guild?.icon) {
      embed.setThumbnail(guild?.iconURL({ size: 256 }))
    }

    embed.setTitle(guild?.name!).addFields(
      [
        {
          name: polyglot.t('commands.guild.info.information'),
          value: [
            `${polyglot.t('commands.guild.info.id')}: ${guild?.id}`,
            `${polyglot.t(
              'commands.guild.info.acronym'
            )}: ${guild?.nameAcronym}`,
            `${polyglot.t('commands.guild.info.verified')}: ${polyglot.yn(
              guild?.verified!
            )}`,
            `${polyglot.t('commands.guild.info.created')}: ${guild?.createdAt?.toString()}`,
            `${polyglot.t(
              'commands.guild.info.owner'
            )}: ${(await guild?.fetchOwner())?.toString()}`,
            `${polyglot.t(
              'commands.guild.info.locale'
            )}: ${guild?.preferredLocale}`
          ].join('\n')
        },
        {
          name: polyglot.t('commands.guild.info.premium'),
          value: [
            `${polyglot.t('commands.guild.info.tier')} ${guild?.premiumTier}`,
            `${polyglot.t('commands.guild.info.boosts')}: ${
              guild?.premiumSubscriptionCount
                ? guild.premiumSubscriptionCount
                : 0
            }${
              guild?.premiumTier! < 3
                ? `/${this.maximumBoostForEachPremiumTier[guild?.premiumTier!]}`
                : ''
            }`
          ].join('\n')
        },
        {
          name: polyglot.t('commands.guild.info.moderation'),
          value: [
            `${polyglot.t('commands.guild.info.afk_channel')}: ${
              guild?.afkChannelId
                ? guild.afkChannel?.toString()
                : polyglot.t('commons.none')
            }`,
            `${polyglot.t(
              'commands.guild.info.afk_timeout'
            )}: ${guild?.afkTimeout}`,
            `${polyglot.t(
              'commands.guild.info.mfa_level'
            )}: ${guild?.mfaLevel}`,
            `${polyglot.t(
              'commands.guild.info.content_filter'
            )}: ${guild?.explicitContentFilter}`,
            `${polyglot.t(
              'commands.guild.info.verification'
            )}: ${guild?.verificationLevel}`
          ].join('\n')
        },
        {
          name: polyglot.t('commands.guild.info.channels'),
          value: [
            `${polyglot.t(
              'commands.guild.info.system'
            )}: ${guild?.systemChannel?.toString()}`,
            `${polyglot.t('commands.guild.info.widget')}: ${
              guild?.widgetEnabled && guild?.widgetChannelId
                ? guild.widgetChannel?.name
                : polyglot.t('commons.none')
            }`,
            `${polyglot.t('commands.guild.info.rules')}: ${
              guild?.rulesChannelId
                ? guild.rulesChannel?.toString()
                : polyglot.t('commons.none')
            }`
          ].join('\n'),
          inline: false
        },
        {
          name: polyglot.t('commands.guild.info.counts'),
          value: [
            `${polyglot.t(
              'commands.guild.info.members'
            )}: ${guild?.memberCount}`,
            `${polyglot.t(
              'commands.guild.info.maximum_members'
            )}: ${guild?.maximumMembers}`,
            `${polyglot.t('commands.guild.info.emojis')}: ${emojis?.size}`,
            `- [${polyglot.t('commands.guild.info.static')}]: ${
              emojis?.filter(({ animated }) => !animated).size
            }`,
            `- [${polyglot.t(
              'commands.guild.info.animated'
            )}]: ${emojis?.filter(({ animated }) => animated).size}`
          ].join('\n')
        },
        {
          name: blank(),
          value: [
            `${polyglot.t('commands.guild.info.roles')}: ${
              roles?.size ? roles.size - 1 : 0
            }`,
            `- [${polyglot.t(
              'commands.guild.info.unmanaged'
            )}]: ${roles?.filter(({ editable }) => !editable).size}`,
            `- [${polyglot.t('commands.guild.info.managed')}]: ${
              roles?.size
                ? roles.filter(({ editable }) => editable).size - 1
                : 0
            }`,
            `${polyglot.t('commands.guild.info.stickers')}: ${
              guild?.stickers.cache.size
            }`
          ].join('\n')
        }
      ].map((field) =>
        field.inline !== false ? { ...field, inline: true } : field
      )
    )

    return await interaction.reply({ embeds: [embed] })
  }

  private get maximumBoostForEachPremiumTier (): Record<number, number | null> {
    return {
      0: 2,
      1: 7,
      2: 14,
      3: null
    }
  }
}
