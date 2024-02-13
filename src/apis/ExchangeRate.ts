import ApiWrapper from '@structures/ApiWrapper'
import { GET } from '@utils/http'

interface IExchangeRateApiResponse {
  time_last_updated: number
  rates: {
    [currencyCode: string]: number
  }
}

export default class ExchangeRate extends ApiWrapper {
  private version: number

  constructor () {
    super({ name: 'exchangeRate', baseUrl: 'https://api.exchangerate-api.com' })

    this.version = 4
  }

  public async convert (
    amount: number,
    fromCurrency: string,
    toCurrency: string
  ) {
    const data = await this.request(fromCurrency, toCurrency)
    const convertedAmount = (amount * data.to.rate) / data.from.rate

    return { ...data, result: convertedAmount.toFixed(2) }
  }

  private request (fromCurrency: string, toCurrency: string) {
    return GET<IExchangeRateApiResponse>(
      `${this.baseUrl}/v${this.version}/latest/${fromCurrency}`
    ).then((data) => ({
      from: { currency: fromCurrency, rate: data.rates[fromCurrency] },
      to: { currency: toCurrency, rate: data.rates[toCurrency] },
      updated_at: data.time_last_updated
    }))
  }
}
