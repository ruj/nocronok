import type { Logger } from 'pino'

import { type IListenerOptions, type IOptionHandler } from '@interfaces'
import { optionHandler } from '@utils'

import type Nocronok from './base/Nocronok'

export default class Listener {
  private readonly listenerOptions: IOptionHandler<IListenerOptions>
  public unifiedEvents: boolean | undefined
  public events: string[] | null | undefined
  public client: Nocronok
  public logger: Logger

  constructor (client: Nocronok, options: IListenerOptions = {}) {
    this.listenerOptions = optionHandler('Listener', options)

    this.unifiedEvents = this.listenerOptions.default('unifiedEvents', false)
    this.events = this.listenerOptions.optional('events')

    this.client = client
    this.logger = client.logger
  }
}
