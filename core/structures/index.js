const CommandStructures = require('./command')

module.exports = {
  CommandStructures,
  Command: CommandStructures.Command,
  CommandContext: CommandStructures.Context,

  Listener: require('./Listener.js'),
  Loader: require('./Loader.js')
}
