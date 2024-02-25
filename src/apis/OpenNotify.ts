import ApiWrapper from '@structures/ApiWrapper'
import { GET } from '@utils/http'

export interface IOpenNotifyIssPosition {
  latitude: string
  longitude: string
}

export interface IOpenNotifyIssApiResponse {
  message: string
  iss_position: IOpenNotifyIssPosition
  timestamp: number
}

export interface IOpenNotifyIssPersonDetail {
  name: string
  craft: string
}

export interface IOpenNotifyAstrosApiResponse {
  message: string
  people: IOpenNotifyIssPersonDetail[]
  number: number
}

export default class OpenNotify extends ApiWrapper {
  constructor () {
    super({ name: 'openNotify', baseUrl: 'http://api.open-notify.org' })
  }

  public async iss (): Promise<IOpenNotifyIssApiResponse> {
    return await this.request('iss-now')
  }

  public async astros (): Promise<IOpenNotifyAstrosApiResponse> {
    return await this.request('astros')
  }

  private async request<Type> (endpoint: string): Promise<Type> {
    return await GET<Type>(`${this.baseUrl}/${endpoint}`)
  }
}
