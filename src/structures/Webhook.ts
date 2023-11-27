import {
  WebhookClient,
  WebhookClientData,
  WebhookClientOptions
} from 'discord.js'

const { DISCORD_DEFAULT_WEBHOOK_ID, DISCORD_DEFAULT_WEBHOOK_TOKEN } =
  process.env

export default class Webhook extends WebhookClient {
  constructor (
    data: WebhookClientData = {
      id: DISCORD_DEFAULT_WEBHOOK_ID!,
      token: DISCORD_DEFAULT_WEBHOOK_TOKEN!
    },
    options?: WebhookClientOptions
  ) {
    super(data, options)
  }
}
