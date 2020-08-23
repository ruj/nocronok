const { Command } = require('../../structures')

module.exports = class Ping extends Command {
  constructor (client) {
    super({
      name: 'ping',
      aliases: ['pang', 'peng', 'pong', 'pung'],
      category: 'bot'
    }, client)
  }

  execute ({ message }) {
    message.channel.send(Math.ceil(this.client.ws.ping) + 'ms')
  }
}