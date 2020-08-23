const { Listener } = require('../structures')

module.exports = class Message extends Listener {
  constructor (client) {
    super(client)
  }

  onMessage (message) {
    if (message.author.bot) return

    const prefix = ']'

    if (prefix) {
      const content = message.content.substring(prefix.length).split(/[ \t]+/)
      const parameters = content.slice(1)

      if (!content.length) return

      const commandName = content.shift().toLowerCase().trim()
      const command = this.client.commands.find((command) => command.name.toLowerCase() === commandName || (command.aliases && command.aliases.includes(commandName)))

      if (command) {
        const context = {
          client: this.client,
          message,
          command
        }

        this.client.executeCommand(command, context, parameters)
      }
    }
  }
}
