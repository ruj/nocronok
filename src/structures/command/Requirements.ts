import type { GuildMember } from 'discord.js'

import {
  type ICommandRequirementsOptions,
  type ICommandRequirementsParsedOptions
} from '@interfaces'
import { type PolyglotExtended } from '@types'
import Options from '@utils/Options'

export default class Requirements {
  private static parseOptions (
    options: ICommandRequirementsOptions
  ): ICommandRequirementsParsedOptions {
    return {
      developersOnly: options.developersOnly ?? false,

      errors: {
        developersOnly: 'errors.developersOnly'
      }
    }
  }

  public static async handle (
    { member, polyglot }: { member: GuildMember; polyglot: PolyglotExtended },
    requirementsOptions: ICommandRequirementsOptions
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
  }
}
