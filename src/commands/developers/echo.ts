import type Nocronok from '@structures/base/Nocronok'
import { Command, Context, SlashCommandBuilder } from '@structures/command'

export default class Echo extends Command {
  constructor (client: Nocronok) {
    super(client, { requirements: { developersOnly: true } })
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

  public async execute ({ interaction, channel }: Context) {
    const input = interaction.options.getString('input')

    await interaction.deferReply()
    await interaction.deleteReply()

    return channel?.send(input!)
  }
}
