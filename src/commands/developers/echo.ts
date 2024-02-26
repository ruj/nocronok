import { type Message } from 'discord.js'

import type Nocronok from '@structures/base/Nocronok'
import { Command, type Context, SlashCommandBuilder } from '@structures/command'

export default abstract class Echo extends Command {
  constructor (client: Nocronok) {
    super(client, { name: 'echo', requirements: { developersOnly: true } })
  }

  public static data = new SlashCommandBuilder()
    .setName('echo')
    .setDescription('Replies with your input message')
    .addStringOption((option) =>
      option
        .setName('input')
        .setDescription('The input to echo back')
        .setRequired(true)
    )
    .setDMPermission(false)

  public async execute ({
    interaction,
    channel
  }: Context): Promise<Message<false> | Message<true> | undefined> {
    const input = interaction.options.getString('input')

    await interaction.deferReply()
    await interaction.deleteReply()

    return await channel?.send(input!)
  }
}
