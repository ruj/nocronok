import { ECurrencyCode } from '@enums'
import type Nocronok from '@structures/base/Nocronok'
import { ParentCommand, SlashCommandBuilder } from '@structures/command'

const choices = Object.entries(ECurrencyCode).map(([name, value]) => ({
  name,
  value
}))

export default abstract class Currency extends ParentCommand {
  constructor (client: Nocronok) {
    super(client, { name: 'currency', parent: true })
  }

  public static data = new SlashCommandBuilder()
    .setName('currency')
    .setDescription('Currency operations')
    .addSubcommand((subcommand) =>
      subcommand
        .setName('convert')
        .setDescription('Currency conversion')
        .addStringOption((option) =>
          option
            .setName('from_currency')
            .setDescription('Currency code you want to convert')
            .addChoices(...choices)
            .setRequired(true)
        )
        .addStringOption((option) =>
          option
            .setName('to_currency')
            .setDescription('Currency code you want to convert to')
            .addChoices(...choices)
            .setRequired(true)
        )
        .addNumberOption((option) =>
          option
            .setName('amount')
            .setDescription('Amount you want to convert')
            .setMinValue(1)
            .setRequired(true)
        )
    )
    .setDMPermission(false)
}
