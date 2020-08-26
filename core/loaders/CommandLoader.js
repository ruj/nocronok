const { Loader } = require('../structures')

module.exports = class CommandLoader extends Loader {
  constructor (client) {
    super(client)

    this.client.commands = []
  }

  load () {
    return this.loadFiles('core/commands')
  }

  loadFile (Command) {
    this.client.commands.push(new Command(this.client))
  }
}
