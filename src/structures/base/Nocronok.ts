import { Client, GatewayIntentBits } from 'discord.js'

import Logger from './Logger'

export default class Nocronok extends Client {
  public logger

  constructor () {
    super({
      intents: [GatewayIntentBits.Guilds]
    })

    this.logger = new Logger({ prettyPrint: true })
  }
}
