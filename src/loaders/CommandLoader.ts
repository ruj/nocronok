import type Nocronok from '@structures/base/Nocronok'
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
    const { name } = Command.data.toJSON()

    this.client.commands.set(name, command)
  }
}
