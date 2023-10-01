import { PrismaClient } from '@prisma/client'
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
  public prisma: PrismaClient

  constructor () {
    super({
      intents: [GatewayIntentBits.Guilds]
    })

    this.logger = logger({ prettyPrint: !process.env.NODE_ENV })
    this.defaultOptions = Options.defaultOptions()

    this.apis = {}
    this.commands = new Map()
    this.prisma = new PrismaClient()

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
