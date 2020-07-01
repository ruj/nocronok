const { Listener } = require('../structures')

module.exports = class Ready extends Listener {
  constructor(client) {
    super(client)
  }

  onReady() {
    this.client.log(this.client.user)
  }
}