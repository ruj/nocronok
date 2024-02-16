import { bold } from 'discord.js'

import { ECurrencySymbol } from '@enums'
import type Nocronok from '@structures/base/Nocronok'
import { Command, Context, Embed } from '@structures/command'
import { blank, camelize } from '@utils'

export default abstract class CurrencyConvert extends Command {
  constructor (client: Nocronok) {
    super(client, { name: 'convert', parentName: 'currency' })
  }

  public async execute ({ interaction, polyglot }: Context) {
    const fromCurrency = interaction.options.getString('from')!
    const toCurrency = interaction.options.getString('to')!

    if (fromCurrency === toCurrency) {
      return await interaction.reply({
        content: polyglot.t('commands.currency.convert.same_currency_code'),
        ephemeral: true
      })
    }

    const amount = interaction.options.getNumber('amount')
    const data = camelize(
      await this.client.apis.exchangeRate.convert(
        amount,
        fromCurrency,
        toCurrency
      )
    )

    const fromCurrencySymbol = this.getCurrencySymbol(fromCurrency)
    const toCurrencySymbol = this.getCurrencySymbol(toCurrency)
    const embed = new Embed()

    embed
      .addFields([
        {
          name: fromCurrency,
          value: `${fromCurrencySymbol} ${data.from.rate}`,
          inline: true
        },
        {
          name: toCurrency,
          value: `${toCurrencySymbol} ${data.to.rate}`,
          inline: true
        },
        {
          name: blank(),
          value: [
            bold(`${fromCurrencySymbol} ${amount}`),
            polyglot.t('commands.currency.convert.is_approximately'),
            bold(`${toCurrencySymbol} ${data.result}`)
          ].join(' ')
        }
      ])
      .setFooter({ text: new Date(data.updatedAt * 1000).toString() })

    return await interaction.reply({ embeds: [embed] })
  }

  private getCurrencySymbol (currency: string): string {
    return ECurrencySymbol[currency as keyof typeof ECurrencySymbol]
  }
}
