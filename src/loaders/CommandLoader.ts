import type Nocronok from '@structures/base/Nocronok'
import type { Command } from '@structures/command'
import Loader from '@structures/Loader'

export default class CommandLoader extends Loader {
  constructor (client: Nocronok) {
    super(client)
  }

  public load () {
    return this.loadFiles('commands')
  }

  public loadFile (Command: any) {
    const command = new Command(this.client)

    this.addCommand(command)
  }

  private addCommand (command: Command) {
    if (typeof command.parentName !== 'string') {
      this.client.commands.set(command.name, command)
    } else {
      this.addSubcommand(command)
    }

    return true
  }

  private addSubcommand (subcommand: Command) {
    let parentSubcommand

    if (
      typeof subcommand.parentName === 'string' &&
      this.client.commands.has(subcommand.parentName)
    ) {
      parentSubcommand = this.client.commands.get(subcommand.parentName)
    }

    if (!parentSubcommand) {
      this.logger.warn(
        { labels: ['CommandLoader', 'addSubcommand()'] },
        `${parentSubcommand.name} failed to load - Couldn't find parent command`
      )

      return false
    } else {
      const subcommandName = [subcommand.parentName, subcommand.name].join('.')

      this.client.commands.set(subcommandName, subcommand)

      return true
    }
  }
}
