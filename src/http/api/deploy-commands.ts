import {
  REST,
  type RESTPostAPIChatInputApplicationCommandsJSONBody,
  Routes
} from 'discord.js'
import { type Request, type Response } from 'express'

import { type IRouteOptions } from '@interfaces'
import type Nocronok from '@structures/base/Nocronok'
import { type Command } from '@structures/command'
import Route from '@structures/Route'
import { pluralize } from '@utils'
import File from '@utils/File'

interface IQueryParameters {
  guild_id?: string
  specific_commands?: string
}

export default class DeployCommands extends Route {
  private readonly version: string

  constructor (client: Nocronok, options: IRouteOptions) {
    super(client, {
      ...options,
      endpoints: [{ method: 'POST', path: '/' }]
    })

    this.version = '10'
  }

  public async handler (
    request: Request,
    response: Response
  ): Promise<Response<any, Record<string, any>>> {
    const { guild_id: guildId, specific_commands: specificCommmands } =
      request.query as IQueryParameters

    if (guildId && !/^\d+$/.test(guildId)) {
      return response
        .status(400)
        .json({ message: 'The provided guild is invalid' })
    }

    const clientId = this.client.user?.id

    const rest = new REST({ version: this.version }).setToken(
      this.client.token!
    )

    let commands: RESTPostAPIChatInputApplicationCommandsJSONBody[] = []

    await File.requireDirectory(
      'src/commands',
      (command: Command) =>
        !command.parentName && commands.push(command.data.toJSON()),
      () => {}
    )

    if (specificCommmands) {
      commands = commands.filter((command) =>
        specificCommmands
          .split(',')
          .some(
            (specificCommmandName) =>
              command.name === specificCommmandName.toLowerCase()
          )
      )
    }

    await rest.put(
      guildId
        ? Routes.applicationGuildCommands(clientId!, guildId)
        : Routes.applicationCommands(clientId!),
      {
        body: commands
      }
    )

    this.logger.info(
      { labels: ['http', 'api/deploy-commands'] },
      `${commands.length} command${pluralize(commands.length !== 1)} were updated`
    )

    return response.status(200).json({
      message: commands.length
        ? 'Successfully reloaded application (/) commands'
        : 'No command reloaded'
    })
  }
}
