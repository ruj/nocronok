const CommandStructures = require('./command')

module.exports = {
  CommandStructures,
  Command: CommandStructures.Command,
  Listener: require('./Listener.js'),
  Loader: require('./Loader.js')
}
