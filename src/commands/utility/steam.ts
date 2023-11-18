import type Nocronok from '@structures/base/Nocronok'
import { ParentCommand, SlashCommandBuilder } from '@structures/command'

export default abstract class Steam extends ParentCommand {
  constructor (client: Nocronok) {
    super(client, { name: 'steam', parent: true })
  }

  public static data = new SlashCommandBuilder()
    .setName('steam')
    .setDescription('Steam information')
    .addSubcommand((subcommand) =>
      subcommand
        .setName('user')
        .setDescription('Display user details')
        .addStringOption((option) =>
          option
            .setName('user')
            .setDescription('User who wants to view the information')
            .setRequired(true)
        )
    )
    .setDMPermission(false)
}
