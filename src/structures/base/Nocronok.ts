import { Client, GatewayIntentBits } from 'discord.js'

import loaders from '@loaders'

import { logger } from './Logger'

export default class Nocronok extends Client {
  public logger

  constructor () {
    super({
      intents: [GatewayIntentBits.Guilds]
    })

    this.logger = logger({ prettyPrint: true })

    this.initializeLoaders()
  }

  private async initializeLoaders () {
    for (const name in loaders) {
      const loader = new loaders[name](this)

      try {
        await loader.load()
      } catch (error) {
        if (error instanceof Error) {
          this.logger.error(
            { labels: ['initializeLoaders'], loader: name },
            error.message
          )
        }
      }
    }
  }
}
