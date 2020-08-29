const { Client } = require('discord.js')
const Loaders = require('../../loaders')

module.exports = class Nocronok extends Client {
  constructor (options) {
    super(options)

    this.initializeLoaders()
  }

  log (message) {
    console.log(message)
  }

  logError (...args) {
    console.error(args)
  }

  async initializeLoaders () {
    for (const name in Loaders) {
      const loader = new Loaders[name](this)

      try {
        await loader.load()
      } catch (error) {
        this.logError('initializeLoaders', error)
      }
    }
  }

  executeCommand (command, context, parameters) {
    return command._execute(context, parameters).catch(this.logError)
  }
}
