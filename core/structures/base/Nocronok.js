const { Client } = require('discord.js')
const Loaders = require('../../loaders')
const Logger = require('./Logger.js')

module.exports = class Nocronok extends Client {
  constructor (options) {
    super(options)

    this.logger = new Logger()
    this.initializeLoaders()
  }

  print (scope, message, options) {
    this.logger.print(scope, message, options)
  }

  printError (...args) {
    this.logger.printError(...args)
  }

  async initializeLoaders () {
    for (const name in Loaders) {
      const loader = new Loaders[name](this)

      try {
        await loader.load()
      } catch (error) {
        this.printError('initializeLoaders', error)
      }
    }
  }

  executeCommand (command, context, parameters) {
    return command._execute(context, parameters).catch(this.printError)
  }
}
