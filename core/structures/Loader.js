const { FileUtils } = require('../utils')

module.exports = class Loader {
  constructor(client) {
    this.client = client
  }

  async loadFiles(path) {
    await FileUtils.requireDirectory(path, (file, filename) => {
      this.loadFile(file, filename)
    }, this.client.logError)
  }
}