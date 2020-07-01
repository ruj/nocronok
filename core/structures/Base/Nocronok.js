const { Client } = require('discord.js')
const Loaders = require('../../loaders')

module.exports = class Nocronok extends Client {
  constructor(options) {
    super(options)

    this.initializeLoaders()
    this.login()
  }

  login(token = process.env.DISCORD_TOKEN) {
    return super.login(token)
  }

  log(message) {
    console.log(message)
  }

  logError(...args) {
    console.error(args)
  }

  async initializeLoaders() {
    for (let name in Loaders) {
      const loader = new Loaders[name](this)

      try {
        await loader.load()
      } catch (error) {
        this.logError('initializeLoaders', error)
      }
    }
  }
}