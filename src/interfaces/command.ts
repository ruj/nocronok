import type { CommandInteraction } from 'discord.js'

export interface ICommandRequirementsOptions {}

export interface ICommandRequirementsParsedOptions
  extends ICommandRequirementsOptions {
  errors: { [key: string]: string }
}

export interface ICommandOptions {}

export interface ICommandContextOptions {
  interaction: CommandInteraction
}
