import ApiWrapper from '@structures/ApiWrapper'
import { GET } from '@utils/http'

export interface IExchangeRateApiResponse {
  time_last_updated: number
  rates: Record<string, number>
}

export interface IEnchangeRateCurrencyDetail {
  currency: string
  rate: number
}

export interface IExchangeRateConvert {
  from: IEnchangeRateCurrencyDetail
  to: IEnchangeRateCurrencyDetail
  updatedAt: number
}

export default class ExchangeRate extends ApiWrapper {
  private readonly version: number

  constructor () {
    super({ name: 'exchangeRate', baseUrl: 'https://api.exchangerate-api.com' })

    this.version = 4
  }

  public async convert (
    amount: number,
    fromCurrency: string,
    toCurrency: string
  ): Promise<IExchangeRateConvert & { result: string }> {
    const data = await this.request(fromCurrency, toCurrency)
    const convertedAmount = (amount * data.to.rate) / data.from.rate

    return { ...data, result: convertedAmount.toFixed(2) }
  }

  private async request (
    fromCurrency: string,
    toCurrency: string
  ): Promise<IExchangeRateConvert> {
    return await GET<IExchangeRateApiResponse>(
      `${this.baseUrl}/v${this.version}/latest/${fromCurrency}`
    ).then((data) => ({
      from: { currency: fromCurrency, rate: data.rates[fromCurrency] },
      to: { currency: toCurrency, rate: data.rates[toCurrency] },
      updatedAt: data.time_last_updated
    }))
  }
}
