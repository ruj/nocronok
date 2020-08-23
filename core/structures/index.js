const CommandStructures = require('./Command')

module.exports = {
  CommandStructures,
  Command: CommandStructures.Command,
  Listener: require('./Listener.js'),
  Loader: require('./Loader.js')
}
