import type { SlashCommandBuilder, User } from 'discord.js'
import type { Logger } from 'pino'

import {
  type ICommandOptions,
  type ICommandRequirementsOptions,
  type IOptionHandler
} from '@interfaces'
import type Nocronok from '@structures/base/Nocronok'
import { optionHandler } from '@utils'
import Environment from '@utils/Environment'
import Mapper from '@utils/Mapper'

import type Context from './Context'
import Requirements from './Requirements'

export default abstract class Command {
  private readonly commandOptions: IOptionHandler<ICommandOptions>
  public name: string
  public parent?: boolean
  public parentName?: string | null
  public requirements?: ICommandRequirementsOptions | null
  public client: Nocronok
  public logger: Logger
  public data: SlashCommandBuilder
  public cooldownTime: number
  public cooldownFeedback: boolean
  public cooldowns: Mapper<string, number> | null
  public abstract execute(context: Context): Promise<any>
  public abstract preExecute(context: Context): Promise<any>

  constructor (client: Nocronok, options: ICommandOptions) {
    this.commandOptions = optionHandler('Command', options)

    this.name = this.commandOptions.required('name')
    this.parent = this.commandOptions.default('parent', false)
    this.parentName = this.commandOptions.optional('parentName')
    this.requirements = this.commandOptions.optional('requirements')

    this.client = client
    this.logger = client.logger

    this.data = {} as unknown as SlashCommandBuilder

    this.cooldownTime = 0
    this.cooldownFeedback = true
    this.cooldowns = new Mapper()
  }

  public async executeCommand (context: Context): Promise<void> {
    try {
      await this.handleRequirements(context)
      this.applyCooldown(context.user)

      if (this.parent) {
        await this.preExecute(context)
      } else {
        await this.execute(context)
      }
    } catch (error) {
      void this.error(context, error)
    }
  }

  public applyCooldown (
    user: User,
    time = this.cooldownTime
  ): false | undefined {
    if (!user || !(time > 0)) {
      return false
    }

    if (!this.cooldowns?.has(user.id)) {
      this.cooldowns?.set(user.id, Date.now())

      setTimeout(() => {
        this.cooldowns?.delete(user.id)
      }, time * 1e3)
    }
  }

  public async handleRequirements (context: Context): Promise<boolean> {
    const requirements = this.requirements ?? {}

    if (Object.keys(requirements).length > 0 || this.cooldowns?.size! > 0) {
      await Requirements.handle(
        context,
        requirements as ICommandRequirementsOptions
      )
    }

    return true
  }

  public async error ({ interaction }: Context, error: any): Promise<void> {
    if (error instanceof Error) {
      await interaction.reply({ content: error.message, ephemeral: true })

      this.logger.error(
        { labels: ['Command', 'execute'], ...(Environment.isDev() && error) },
        error.message
      )
    }
  }
}
