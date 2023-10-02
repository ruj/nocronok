import type Nocronok from '@structures/base/Nocronok'
import { Command, Context, SlashCommandBuilder } from '@structures/command'

export default class Avatar extends Command {
  constructor (client: Nocronok) {
    super(client)
  }

  public static data = new SlashCommandBuilder()
    .setName('avatar')
    .setDescription('Display user avatar')
    .addUserOption((option) =>
      option
        .setName('user')
        .setDescription('User to display avatar')
        .setRequired(false)
    )

  public async execute ({ interaction }: Context) {
    const user = interaction.options.getUser('user')

    return await interaction.reply(
      user
        ? user.displayAvatarURL({ size: 2048 })
        : interaction.user.displayAvatarURL({ size: 2048 })
    )
  }
}
