import { type InteractionResponse } from 'discord.js'

import type Nocronok from '@structures/base/Nocronok'
import { Command, type Context } from '@structures/command'

export default abstract class GuildIcon extends Command {
  constructor (client: Nocronok) {
    super(client, { name: 'icon', parentName: 'guild' })
  }

  public async execute ({
    interaction,
    guild,
    polyglot
  }: Context): Promise<InteractionResponse<boolean>> {
    return await interaction.reply(
      guild?.icon
        ? guild?.iconURL({ size: 4096 })!
        : polyglot.t('commands.guild.icon.no_icon')
    )
  }
}
