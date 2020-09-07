const { optionHandler } = require('../../utils')

module.exports = class Command {
  constructor (options, client) {
    options = optionHandler('Command', options)

    this.name = options.required('name')
    this.aliases = options.optional('aliases')
    this.category = options.default('category', 'general')

    this.client = client
  }

  async _execute (context, parameters) {
    try {
      await this.execute(context, parameters)
    } catch (error) {
      this.error(context, error)
    }
  }

  error ({ channel }, error) {
    if (error instanceof Error) {
      return channel.send(error.message, { code: 'fix' })
    }

    this.client.logError(error)
  }
}
