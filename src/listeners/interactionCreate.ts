import type {
  ChatInputCommandInteraction,
  CommandInteraction,
  TextChannel
} from 'discord.js'

import type Nocronok from '@structures/base/Nocronok'
import { Context } from '@structures/command'
import Listener from '@structures/Listener'

export default class InteractionCreate extends Listener {
  public commands: Map<string, any>

  constructor (client: Nocronok) {
    super(client)

    this.commands = client.commands
  }

  public async onInteractionCreate (
    interaction: CommandInteraction & ChatInputCommandInteraction
  ): Promise<false | undefined> {
    if (!interaction.isCommand()) return false
    if (!interaction.guildId || !interaction.channelId) return false
    if (!interaction.client.guilds.cache.get(interaction.guildId)) return false

    const commandName = interaction.commandName
    const subCommandName = interaction.options.getSubcommand(false)

    if (this.commands.has(commandName)) {
      const { channel, guild, user } = interaction
      const command = this.commands.get(commandName)
      const context = new Context({ command, interaction })

      context.setPolyglot(this.client.polyglots.get(guild?.preferredLocale!)!)

      this.logger.debug(
        { labels: ['Listener', 'interactionCreate'] },
        `/${commandName}${subCommandName ? ` ${subCommandName}` : ''} run by ${
          !+user.discriminator ? user.username : user.tag
        } (${user.id}) on channel ${
          (channel as TextChannel).name
        } (${channel?.id}), guild ${guild?.name} (${guild?.id}).`
      )

      command.executeCommand(context)
    }
  }
}
