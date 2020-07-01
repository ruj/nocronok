const { Listener } = require('../structures')

module.exports = class Message extends Listener {
  constructor (client) {
    super(client)
  }

  onMessage (message) {
    if (message.author.bot) return
    this.client.log(message.content)
  }
}
