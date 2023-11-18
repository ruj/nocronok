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
  public name: string
  public parent?: boolean
  public parentName?: string
  public requirements?: ICommandRequirementsOptions
  public client: Nocronok
  public logger: Logger
  public data: SlashCommandBuilder
  public abstract execute(context: Context): any
  public abstract preExecute(context: Context): any

  constructor (client: Nocronok, options: ICommandOptions) {
    this.commandOptions = optionHandler('Command', options)

    this.name = this.commandOptions.required('name')
    this.parent = this.commandOptions.default('parent', false)
    this.parentName = this.commandOptions.optional('parentName')
    this.requirements = this.commandOptions.optional('requirements')

    this.client = client
    this.logger = client.logger

    this.data = {} as SlashCommandBuilder
  }

  public async executeCommand (context: Context) {
    try {
      await this.handleRequirements(context)

      if (this.parent) {
        await this.preExecute(context)
      } else {
        await this.execute(context)
      }
    } catch (error) {
      this.error(context, error)
    }
  }

  private handleRequirements (context: Context) {
    return this.requirements
      ? Requirements.handle(context, this.requirements)
      : true
  }

  public async error ({ interaction }: Context, error: any) {
    if (error instanceof Error) {
      await interaction.reply({ content: error.message, ephemeral: true })
    }

    this.logger.error({ labels: ['Command', 'execute'] }, error.message)
  }
}
