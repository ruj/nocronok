import type { GuildMember, User } from 'discord.js'

import {
  type ICommandRequirementsOptions,
  type ICommandRequirementsParsedOptions
} from '@interfaces'
import { type PolyglotExtended } from '@types'
import Options from '@utils/Options'

import type Command from './Command'

export default class Requirements {
  private static parseOptions (
    options?: ICommandRequirementsOptions
  ): ICommandRequirementsParsedOptions {
    return {
      developersOnly: options?.developersOnly ?? false,

      errors: {
        developersOnly: 'errors.developersOnly',
        cooldown: 'errors.cooldown'
      }
    }
  }

  public static async handle (
    {
      command,
      member,
      user,
      polyglot
    }: {
      command: Command
      member: GuildMember
      user: User
      polyglot: PolyglotExtended
    },
    requirementsOptions?: ICommandRequirementsOptions
  ): Promise<void> {
    const options = Requirements.parseOptions(requirementsOptions)
    const defaultOptions = Options.defaultOptions()

    if (options.developersOnly) {
      const isDeveloper =
        defaultOptions.env.DEVELOPERS_ID?.includes(member.id) ?? false

      if (!isDeveloper) {
        throw new Error(polyglot.t(options.errors.developersOnly))
      }
    }

    if (command.cooldownTime > 0 && command.cooldowns?.has(user.id)) {
      if (command.cooldownFeedback) {
        throw new Error(polyglot.t(options.errors.cooldown))
      }
    }
  }
}
