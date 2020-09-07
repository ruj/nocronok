module.exports = class Context {
  constructor (options = {}) {
    this.client = options.client

    this.message = options.message
    this.channel = options.message.channel
    this.command = options.command
  }
}
