const CLIENT_OPTIONS = {
  disableMentions: 'everyone'
}

const { Nocronok } = require('./structures/base')
const client = new Nocronok(CLIENT_OPTIONS)

client.login().catch(client.printError)
