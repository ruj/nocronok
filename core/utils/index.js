class Utils {
  static optionHandler (structure, options = {}) {
    return ({
      default (name, defaultValue) {
        const value = options[name]

        return typeof value === 'undefined'
          ? Array.isArray(defaultValue)
            ? Utils.random(defaultValue)
            : defaultValue
          : value
      },

      optional (name) {
        return options[name] || null
      },

      required (name) {
        const value = options[name]

        if (typeof value === 'undefined') {
          throw new Error(`The "${name}" option in the ${structure} structure is required`)
        }

        return value
      }
    })
  }

  static random (array) {
    return Array.isArray(array) && array.length ? array[~~(Math.random() * array.length)] : array
  }
}

Utils.FileUtils = require('./FileUtils.js')

module.exports = Utils
