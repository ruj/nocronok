import { ICommandOptions } from '@interfaces'
import Nocronok from '@structures/base/Nocronok'

import Command from './Command'
import Context from './Context'

export default abstract class ParentCommand extends Command {
  constructor (client: Nocronok, options: ICommandOptions) {
    super(client, options)
  }

  public async preExecute (context: Context) {
    const subcommand = context.interaction.options.getSubcommand()
    const subcommandName = this.parent
      ? [this.name, subcommand].join('.')
      : null

    if (subcommandName && this.client.commands.has(subcommandName)) {
      this.client.commands.get(subcommandName).execute(context)
    } else {
      this.execute(context)
    }
  }
}
