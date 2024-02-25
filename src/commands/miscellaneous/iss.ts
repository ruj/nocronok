import { bold } from '@discordjs/builders'
import { type InteractionResponse } from 'discord.js'

import type Nocronok from '@structures/base/Nocronok'
import { Command, type Context, SlashCommandBuilder } from '@structures/command'
import { camelize } from '@utils'

export default abstract class Iss extends Command {
  constructor (client: Nocronok) {
    super(client, { name: 'iss' })
  }

  public static data = new SlashCommandBuilder()
    .setName('iss')
    .setDescription('International Space Station current position')
    .setDMPermission(false)

  public async execute ({
    interaction
  }: Context): Promise<InteractionResponse<boolean>> {
    const { issPosition } = camelize(await this.client.apis.openNotify.iss())

    return await interaction.reply(
      `The ISS is currently over ${bold(issPosition.latitude + '° N')}, ${bold(
        issPosition.longitude + '° E'
      )}`
    )
  }
}
