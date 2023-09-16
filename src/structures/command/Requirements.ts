import type { GuildMember } from 'discord.js'

import {
  ICommandRequirementsOptions,
  ICommandRequirementsParsedOptions
} from '@interfaces'
import { Errors } from '@utils/Constants'
import Options from '@utils/Options'

export default class Requirements {
  private static parseOptions (
    options: ICommandRequirementsOptions
  ): ICommandRequirementsParsedOptions {
    return {
      developersOnly: !!options.developersOnly,

      errors: {
        developersOnly: Errors.Command.Requirements.DEVELOPERS_ONLY
      }
    }
  }

  public static async handle (
    { member }: { member: GuildMember },
    requirementsOptions: ICommandRequirementsOptions
  ) {
    const options = Requirements.parseOptions(requirementsOptions)
    const defaultOptions = Options.defaultOptions()

    if (options.developersOnly) {
      const isDeveloper = defaultOptions.env.DEVELOPERS_ID?.includes(member.id)

      if (!isDeveloper) {
        throw new Error(options.errors.developersOnly)
      }
    }
  }
}
