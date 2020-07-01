const { Loader } = require('../structures')

module.exports = class ListenerLoader extends Loader {
  constructor (client) {
    super(client)
  }

  load () {
    return this.loadFiles('core/listeners')
  }

  loadFile (Listener, event) {
    const listener = new Listener(this.client)
    const capitalize = (string) => string.charAt(0).toUpperCase() + string.slice(1)

    this.client.on(event, (...v) => listener['on' + capitalize(event)](...v))
  }
}
