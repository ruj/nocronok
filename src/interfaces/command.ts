import type {
  ChatInputCommandInteraction,
  CommandInteraction
} from 'discord.js'

import { type Command } from '@structures/command'

export interface ICommandRequirementsOptions {
  developersOnly: boolean
}

export interface ICommandRequirementsParsedOptions
  extends ICommandRequirementsOptions {
  errors: { [Key in keyof ICommandRequirementsOptions]: string } & {
    cooldown: string
  }
}

export interface ICommandOptions {
  name: string
  parent?: boolean
  parentName?: string
  requirements?: ICommandRequirementsOptions
}

export interface ICommandContextOptions {
  command: Command
  interaction: CommandInteraction & ChatInputCommandInteraction
}
