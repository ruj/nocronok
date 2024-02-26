import { type InteractionResponse } from 'discord.js'

import { type IIpInfoApiResponse } from '@apis/IpInfo'
import type Nocronok from '@structures/base/Nocronok'
import {
  Command,
  type Context,
  Embed,
  SlashCommandBuilder
} from '@structures/command'

export default abstract class Ip extends Command {
  constructor (client: Nocronok) {
    super(client, { name: 'ip' })
  }

  public static data = new SlashCommandBuilder()
    .setName('ip')
    .setDescription('IP address details')
    .addStringOption((option) =>
      option
        .setName('ip')
        .setDescription('IP address to be searched')
        .setRequired(true)
    )
    .setDMPermission(false)

  public async execute ({
    interaction,
    polyglot
  }: Context): Promise<InteractionResponse<boolean>> {
    const ip = interaction.options.getString('ip')

    if (!/^((25[0-5]|(2[0-4]|1\d|[1-9]|)\d)\.?\b){4}$/.test(ip!)) {
      return await interaction.reply({
        content: polyglot.t('errors.commands.ip.invalid_ip'),
        ephemeral: true
      })
    }

    const data: IIpInfoApiResponse = await this.client.apis.ipInfo.find(ip)
    const [latitude, longitude] = data.loc.split(',')
    const embed = new Embed()

    embed.setDescription(
      [
        `${polyglot.t('commands.ip.ip')}: ${data.ip}`,
        `${polyglot.t('commands.ip.hostname')}: ${data.hostname}`,
        `${polyglot.t('commands.ip.anycast')}: ${polyglot.yn(data.anycast)}`,
        `${polyglot.t('commands.ip.city')}: ${data.city}`,
        `${polyglot.t('commands.ip.region')}: ${data.region}`,
        `${polyglot.t('commands.ip.country')}: ${data.country}`,
        `${polyglot.t('commands.ip.coordinates.latitude')}: ${latitude}`,
        `${polyglot.t('commands.ip.coordinates.longitude')}: ${longitude}`,
        `${polyglot.t('commands.ip.organization')}: ${data.org}`,
        `${polyglot.t('commands.ip.postal_code')}: ${data.postal}`,
        `${polyglot.t('commands.ip.timezone')}: ${data.timezone}`
      ].join('\n')
    )

    return await interaction.reply({ embeds: [embed] })
  }
}
