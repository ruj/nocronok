import { bold } from '@discordjs/builders'

import type Nocronok from '@structures/base/Nocronok'
import { Command, Context, SlashCommandBuilder } from '@structures/command'
import { camelize } from '@utils'

export default class Iss extends Command {
  constructor (client: Nocronok) {
    super(client)
  }

  public static data = new SlashCommandBuilder()
    .setName('iss')
    .setDescription('International Space Station current position')
    .setDMPermission(false)

  public async execute ({ interaction }: Context) {
    const { issPosition } = camelize(await this.client.apis.openNotify.iss())

    return await interaction.reply(
      `The ISS is currently over ${bold(issPosition.latitude + '° N')}, ${bold(
        issPosition.longitude + '° E'
      )}`
    )
  }
}
