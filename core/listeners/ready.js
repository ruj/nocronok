const { Listener } = require('../structures')

module.exports = class Ready extends Listener {
  constructor (client) {
    super(client)
  }

  onReady () {
    this.client.print('ready', `${this.client.user.tag} (${this.client.user.id})`)
  }
}
