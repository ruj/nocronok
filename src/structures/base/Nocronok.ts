import { Client, GatewayIntentBits } from 'discord.js'

import { IDefaultOptions } from '@interfaces'
import loaders from '@loaders'
import Options from '@utils/Options'

import { logger } from './Logger'

export default class Nocronok extends Client {
  public logger
  public defaultOptions: IDefaultOptions
  public apis: { [key: string]: any }
  public commands: Map<string, any>

  constructor () {
    super({
      intents: [GatewayIntentBits.Guilds]
    })

    this.logger = logger({ prettyPrint: true })
    this.defaultOptions = Options.defaultOptions()

    this.apis = {}
    this.commands = new Map()

    this.initializeLoaders()
  }

  private async initializeLoaders () {
    for (const name in loaders) {
      const loader = new loaders[name as keyof typeof loaders](this)

      try {
        await loader.load()
      } catch (error) {
        if (error instanceof Error) {
          this.logger.error(
            { labels: ['initializeLoaders', name] },
            error.message
          )
        }
      }
    }
  }
}
