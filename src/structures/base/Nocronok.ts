import { PrismaClient } from '@prisma/client'
import { Client, GatewayIntentBits } from 'discord.js'

import { type IDefaultOptions } from '@interfaces'
import loaders from '@loaders'
import { type PolyglotExtended } from '@types'
import Mapper from '@utils/Mapper'
import Options from '@utils/Options'

import { logger } from './Logger'

export default class Nocronok extends Client {
  public logger
  public defaultOptions: IDefaultOptions
  public apis: Record<string, any>
  public commands: Mapper<string, any>
  public polyglots: Mapper<string, PolyglotExtended>
  public prisma: PrismaClient

  constructor () {
    super({
      intents: [GatewayIntentBits.Guilds]
    })

    this.logger = logger({ prettyPrint: !process.env.NODE_ENV })
    this.defaultOptions = Options.defaultOptions()

    this.apis = {}
    this.commands = new Mapper()
    this.polyglots = new Mapper<string, PolyglotExtended>()
    this.prisma = new PrismaClient()

    void this.initializeLoaders()
  }

  private async initializeLoaders (): Promise<void> {
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
