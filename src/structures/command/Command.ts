import type { SlashCommandBuilder } from 'discord.js'
import type { Logger } from 'pino'

import {
  ICommandOptions,
  ICommandRequirementsOptions,
  IOptionHandler
} from '@interfaces'
import type Nocronok from '@structures/base/Nocronok'
import { optionHandler } from '@utils'

import Context from './Context'
import Requirements from './Requirements'

export default abstract class Command {
  private commandOptions: IOptionHandler
  public requirements?: ICommandRequirementsOptions
  public client: Nocronok
  public logger: Logger
  public data: SlashCommandBuilder
  public abstract execute(context: Context): unknown

  constructor (client: Nocronok, options: ICommandOptions = {}) {
    this.commandOptions = optionHandler('Command', options)

    this.requirements = this.commandOptions.optional('requirements')

    this.client = client
    this.logger = client.logger

    this.data = {} as SlashCommandBuilder
  }

  public async executeCommand (context: Context) {
    try {
      await this.handleRequirements(context)
      await this.execute(context)
    } catch (error) {
      this.error(context, error)
    }
  }

  private handleRequirements (context: Context) {
    return this.requirements
      ? Requirements.handle(context, this.requirements)
      : true
  }

  private async error ({ interaction }: Context, error: any) {
    if (error instanceof Error) {
      await interaction.reply({ content: error.message, ephemeral: true })
    }

    this.logger.error({ labels: ['Command', 'execute'] }, error.message)
  }
}
