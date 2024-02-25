import type { ImageURLOptions, InteractionResponse, Message } from 'discord.js'

import type Nocronok from '@structures/base/Nocronok'
import { Command, type Context, SlashCommandBuilder } from '@structures/command'

enum EAvatarType {
  GLOBAL = 'GLOBAL',
  SERVER = 'SERVER'
}

export default abstract class Avatar extends Command {
  avatarOptions: ImageURLOptions

  constructor (client: Nocronok) {
    super(client, { name: 'avatar' })

    this.avatarOptions = { size: 4096 }
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
    .addStringOption((option) =>
      option
        .setName('type')
        .setDescription('Type')
        .setRequired(false)
        .addChoices(
          { name: 'Global', value: EAvatarType.GLOBAL },
          { name: 'Server', value: EAvatarType.SERVER }
        )
    )
    .setDMPermission(false)

  public async execute ({
    interaction,
    guild,
    member,
    user: author
  }: Context): Promise<
    InteractionResponse<boolean> | Message<boolean> | undefined
  > {
    const user = interaction.options.getUser('user')
    const type = interaction.options.getString('type')

    if (type) {
      if (type === EAvatarType.GLOBAL) {
        return await interaction.reply(
          user
            ? user.displayAvatarURL(this.avatarOptions)
            : author.displayAvatarURL(this.avatarOptions)
        )
      } else if (type === EAvatarType.SERVER) {
        if (user) {
          const member = await guild?.members.fetch(user)

          return await interaction.reply(
            member?.avatar
              ? member?.avatarURL(this.avatarOptions)!
              : member?.displayAvatarURL(this.avatarOptions)!
          )
        } else {
          return await interaction.reply({
            content: member.avatar
              ? member.avatarURL(this.avatarOptions)
              : member.displayAvatarURL(this.avatarOptions)
          })
        }
      }
    } else {
      return await interaction.reply(
        user
          ? user.displayAvatarURL(this.avatarOptions)
          : author.displayAvatarURL(this.avatarOptions)
      )
    }
  }
}
