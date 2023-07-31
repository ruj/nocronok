import { Client, GatewayIntentBits } from 'discord.js'

export default class Nocronok extends Client {
  constructor () {
    super({
      intents: [GatewayIntentBits.Guilds]
    })
  }
}
