import type Nocronok from '@structures/base/Nocronok'
import { ParentCommand, SlashCommandBuilder } from '@structures/command'

export default abstract class Guild extends ParentCommand {
  constructor (client: Nocronok) {
    super(client, { name: 'guild', parent: true })
  }

  public static data = new SlashCommandBuilder()
    .setName('guild')
    .setDescription('Shows details about the server')
    .addSubcommand((subcommand) =>
      subcommand
        .setName('info')
        .setDescription('Shows detailed server information')
    )
    .setDMPermission(false)
}
