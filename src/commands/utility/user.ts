import type Nocronok from '@structures/base/Nocronok'
import { Command, Context, SlashCommandBuilder } from '@structures/command'

export default class User extends Command {
  constructor (client: Nocronok) {
    super(client)
  }

  public static data = new SlashCommandBuilder()
    .setName('user')
    .setDescription('Shows details about a user or yourself')
    .addUserOption((option) =>
      option
        .setName('user')
        .setDescription('User to shows details about')
        .setRequired(false)
    )
    .setDMPermission(false)

  public async execute ({ interaction, guild, polyglot }: Context) {
    const user = interaction.options.getUser('user')

    console.log(await guild?.members.fetch(user!))

    // console.log(user || author.username)

    await interaction.reply({ content: 'fyi;', ephemeral: true })
  }
}
