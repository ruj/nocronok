import { type InteractionResponse } from 'discord.js'

import type Nocronok from '@structures/base/Nocronok'
import { Command, type Context, SlashCommandBuilder } from '@structures/command'

export default abstract class Ping extends Command {
  constructor (client: Nocronok) {
    super(client, { name: 'ping' })
  }

  public static data = new SlashCommandBuilder()
    .setName('ping')
    .setDescription('pong')
    .setDMPermission(false)

  public async execute ({
    interaction
  }: Context): Promise<InteractionResponse<boolean>> {
    return await interaction.reply(`${~~this.client.ws.ping}ms`)
  }
}
