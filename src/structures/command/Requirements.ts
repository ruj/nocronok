import type { GuildMember } from 'discord.js'

import {
  ICommandRequirementsOptions,
  ICommandRequirementsParsedOptions
} from '@interfaces'
import { PolyglotExtended } from '@types'
import Options from '@utils/Options'

export default class Requirements {
  private static parseOptions (
    options: ICommandRequirementsOptions
  ): ICommandRequirementsParsedOptions {
    return {
      developersOnly: !!options.developersOnly,

      errors: {
        developersOnly: 'errors.developersOnly'
      }
    }
  }

  public static async handle (
    { member, polyglot }: { member: GuildMember; polyglot: PolyglotExtended },
    requirementsOptions: ICommandRequirementsOptions
  ) {
    const options = Requirements.parseOptions(requirementsOptions)
    const defaultOptions = Options.defaultOptions()

    if (options.developersOnly) {
      const isDeveloper = defaultOptions.env.DEVELOPERS_ID?.includes(member.id)

      if (!isDeveloper) {
        throw new Error(polyglot.t(options.errors.developersOnly!))
      }
    }
  }
}
