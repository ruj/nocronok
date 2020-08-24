const CLIENT_OPTIONS = {
  disableMentions: 'everyone'
}

const { Nocronok } = require('./structures/base')
const client = new Nocronok(CLIENT_OPTIONS)

client.log('Starting')
