module.exports = class Context {
  constructor (options = {}) {
    this.client = options.client

    this.message = options.message
    this.command = options.command
  }
}
