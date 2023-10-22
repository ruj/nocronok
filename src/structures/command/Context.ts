import type {
  ChatInputCommandInteraction,
  CommandInteraction,
  Guild,
  GuildMember,
  TextBasedChannel,
  User
} from 'discord.js'
import type Polyglot from 'node-polyglot'

import { ICommandContextOptions } from '@interfaces'

export default class Context {
  public interaction: CommandInteraction & ChatInputCommandInteraction
  public guild: Guild | null
  public channel: TextBasedChannel | null
  public member: GuildMember | any
  public user: User
  public polyglot: Polyglot

  constructor (options: ICommandContextOptions) {
    this.interaction = options.interaction
    this.guild = options.interaction.guild
    this.channel = options.interaction.channel
    this.member = options.interaction.member
    this.user = options.interaction.user

    this.polyglot = {} as Polyglot
  }

  setPolyglot (polyglot: Polyglot) {
    this.polyglot = polyglot
  }
}
