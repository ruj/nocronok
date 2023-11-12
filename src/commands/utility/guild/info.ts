import type Nocronok from '@structures/base/Nocronok'
import { Command, Context, Embed } from '@structures/command'
import { blank } from '@utils'

export default abstract class GuildInfo extends Command {
  constructor (client: Nocronok) {
    super(client, { name: 'info', parentName: 'guild' })
  }

  public async execute ({ interaction, guild, polyglot }: Context) {
    const embed = new Embed()

    const emojis = guild?.emojis.cache
    const roles = guild?.roles.cache

    if (guild?.icon) {
      embed.setThumbnail(guild.iconURL({ size: 256 }))
    }

    embed.setTitle(guild?.name!).addFields(
      [
        {
          name: polyglot.t('commands.guild.information'),
          value: [
            `${polyglot.t('commands.guild.id')}: ${guild?.id}`,
            `${polyglot.t('commands.guild.acronym')}: ${guild?.nameAcronym}`,
            `${polyglot.t('commands.guild.verified')}: ${polyglot.t(
              guild?.verified ? 'commons.yes' : 'commons.no'
            )}`,
            `${polyglot.t('commands.guild.created')}: ${guild?.createdAt}`,
            `${polyglot.t(
              'commands.guild.owner'
            )}: ${await guild?.fetchOwner()}`,
            `${polyglot.t('commands.guild.locale')}: ${guild?.preferredLocale}`
          ].join('\n')
        },
        {
          name: polyglot.t('commands.guild.premium'),
          value: [
            `${polyglot.t('commands.guild.tier')} ${guild?.premiumTier}`,
            `${polyglot.t('commands.guild.boosts')}: ${
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
          name: polyglot.t('commands.guild.moderation'),
          value: [
            `${polyglot.t('commands.guild.afk_channel')}: ${
              guild?.afkChannelId
                ? guild.afkChannel
                : polyglot.t('commons.none')
            }`,
            `${polyglot.t('commands.guild.afk_timeout')}: ${guild?.afkTimeout}`,
            `${polyglot.t('commands.guild.mfa_level')}: ${guild?.mfaLevel}`,
            `${polyglot.t(
              'commands.guild.content_filter'
            )}: ${guild?.explicitContentFilter}`,
            `${polyglot.t(
              'commands.guild.verification'
            )}: ${guild?.verificationLevel}`
          ].join('\n')
        },
        {
          name: polyglot.t('commands.guild.channels'),
          value: [
            `${polyglot.t('commands.guild.system')}: ${guild?.systemChannel}`,
            `${polyglot.t('commands.guild.widget')}: ${
              guild?.widgetChannel
                ? guild.widgetChannel
                : polyglot.t('commons.none')
            }`,
            `${polyglot.t('commands.guild.rules')}: ${
              guild?.rulesChannelId
                ? guild.rulesChannel
                : polyglot.t('commons.none')
            }`
          ].join('\n'),
          inline: false
        },
        {
          name: polyglot.t('commands.guild.counts'),
          value: [
            `${polyglot.t('commands.guild.members')}: ${guild?.memberCount}`,
            `${polyglot.t(
              'commands.guild.maximum_members'
            )}: ${guild?.maximumMembers}`,
            `${polyglot.t('commands.guild.emojis')}: ${emojis?.size}`,
            `- [${polyglot.t('commands.guild.static')}]: ${emojis?.filter(
              ({ animated }) => !animated
            ).size}`,
            `- [${polyglot.t('commands.guild.animated')}]: ${emojis?.filter(
              ({ animated }) => animated
            ).size}`
          ].join('\n')
        },
        {
          name: blank(),
          value: [
            `${polyglot.t('commands.guild.roles')}: ${
              roles?.size ? roles.size - 1 : 0
            }`,
            `- [${polyglot.t('commands.guild.unmanaged')}]: ${roles?.filter(
              ({ editable }) => !editable
            ).size}`,
            `- [${polyglot.t('commands.guild.managed')}]: ${
              roles?.size
                ? roles.filter(({ editable }) => editable).size - 1
                : 0
            }`,
            `${polyglot.t('commands.guild.stickers')}: ${guild?.stickers.cache
              .size}`
          ].join('\n')
        }
      ].map((field) =>
        field.inline !== false ? { ...field, inline: true } : field
      )
    )

    return await interaction.reply({ embeds: [embed] })
  }

  private get maximumBoostForEachPremiumTier () {
    return {
      0: 2,
      1: 7,
      2: 14,
      3: null
    }
  }
}
