import type { ChatInputCommandInteraction, CommandInteraction } from 'discord.js'

export interface ICommandRequirementsOptions {
  developersOnly?: boolean
}

export interface ICommandRequirementsParsedOptions
  extends ICommandRequirementsOptions {
  errors: { [K in keyof ICommandRequirementsOptions]: string }
}

export interface ICommandOptions {
  requirements?: ICommandRequirementsOptions
}

export interface ICommandContextOptions {
  interaction: CommandInteraction & ChatInputCommandInteraction
}
