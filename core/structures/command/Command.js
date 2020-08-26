module.exports = class Command {
  constructor (options, client) {
    this.name = options.name
    this.aliases = options.aliases
    this.category = options.category

    this.client = client
  }

  async _execute (context, parameters) {
    try {
      await this.execute(context, parameters)
    } catch (error) {
      this.client.logError(error)
    }
  }
}
