const { Signale } = require('signale')
const chalk = require('chalk')

module.exports = class Logger extends Signale {
  constructor () {
    super({
      types: {
        error: {
          color: 'red',
          logLevel: 'error'
        },
        info: {
          color: 'blue',
          label: 'info',
          logLevel: 'info'
        },
        debug: {
          color: 'magenta',
          label: 'debug',
          logLevel: 'debug'
        },
        log: {
          logLevel: 'info'
        }
      }
    })

    this._types = this._customTypes
    this._longestLabel = -1
  }

  print (scope, message, { type = 'log', suffix = '' } = {}) {
    this._scopeName = chalk.white(scope ? `[${scope}]` : '')
    this[type]({ message: chalk.yellow(message), suffix })
  }

  printError (...args) {
    const tags = args.length > 1 ? args.slice(0, -1).join('/') : []

    this._scopeName = chalk.white.bgRed(`[Error${tags.length ? '=' + tags : ''}]`)
    this.error(args[args.length - 1])
  }

  _formatScopeName () {
    return this._scopeName
  }
}
