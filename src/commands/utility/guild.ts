import type Nocronok from '@structures/base/Nocronok'
import {
  Command,
  Context,
  Embed,
  SlashCommandBuilder
} from '@structures/command'

export default class Guild extends Command {
  constructor (client: Nocronok) {
    super(client)
  }

  public static data = new SlashCommandBuilder()
    .setName('guild')
    .setDescription('Shows details about the server')
    .setDMPermission(false)

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
            `${polyglot.t('commands.guild.created')}: ${guild?.createdAt}`,
            `${polyglot.t(
              'commands.guild.owner'
            )}: ${await guild?.fetchOwner()}`
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
            }`
          ].join('\n'),
          inline: false
        },
        {
          name: polyglot.t('commands.guild.counts'),
          value: [
            `${polyglot.t('commands.guild.members')}: ${guild?.memberCount}`,
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
          name: ' ',
          value: [
            `${polyglot.t('commands.guild.boosts')}: ${
              guild?.premiumSubscriptionCount
                ? guild.premiumSubscriptionCount
                : 0
            }`,
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
            }`
          ].join('\n')
        }
      ].map((field) =>
        field.inline !== false ? { ...field, inline: true } : field
      )
    )

    return await interaction.reply({ embeds: [embed] })
  }
}
