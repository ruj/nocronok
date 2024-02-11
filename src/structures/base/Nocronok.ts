import { PrismaClient } from '@prisma/client'
import { Client, GatewayIntentBits } from 'discord.js'

import { IDefaultOptions } from '@interfaces'
import loaders from '@loaders'
import { PolyglotExtended } from '@types'
import Options from '@utils/Options'

import { logger } from './Logger'

export default class Nocronok extends Client {
  public logger
  public defaultOptions: IDefaultOptions
  public apis: { [key: string]: any }
  public commands: Map<string, any>
  public polyglots: Map<string, PolyglotExtended>
  public prisma: PrismaClient

  constructor () {
    super({
      intents: [GatewayIntentBits.Guilds]
    })

    this.logger = logger({ prettyPrint: !process.env.NODE_ENV })
    this.defaultOptions = Options.defaultOptions()

    this.apis = {}
    this.commands = new Map()
    this.polyglots = {} as Map<string, PolyglotExtended>
    this.prisma = new PrismaClient()

    this.initializeLoaders()
  }

  private async initializeLoaders () {
    let loaded: number = 0

    for (const [loaderName, Loader] of loaders.entries()) {
      const loader = new Loader(this)

      try {
        await loader.load()
        loaded++
      } catch (error) {
        if (error instanceof Error) {
          this.logger.error(
            { labels: ['initializeLoaders', loaderName] },
            error.message
          )
        }
      } finally {
        if (loaders.lastKey() === loaderName) {
          this.logger.info(
            { labels: ['initializeLoaders'] },
            `Loaders have been loaded (${loaded}/${loaders.size})`
          )
        }
      }
    }
  }
}
