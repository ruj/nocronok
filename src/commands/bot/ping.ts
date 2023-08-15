import type Nocronok from '@structures/base/Nocronok'
import { Command, Context, SlashCommandBuilder } from '@structures/command'

export default class Ping extends Command {
  constructor (client: Nocronok) {
    super(client)
  }

  public static data = new SlashCommandBuilder()
    .setName('ping')
    .setDescription('pong')
    .setDMPermission(false)

  public async execute ({ interaction }: Context) {
    return await interaction.reply(`${~~this.client.ws.ping}ms`)
  }
}
