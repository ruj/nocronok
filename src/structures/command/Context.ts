import type {
  ChatInputCommandInteraction,
  CommandInteraction,
  Guild,
  GuildMember,
  TextBasedChannel,
  User
} from 'discord.js'

import { type ICommandContextOptions } from '@interfaces'
import { type PolyglotExtended } from '@types'

export default class Context {
  public interaction: CommandInteraction & ChatInputCommandInteraction
  public guild: Guild | null
  public channel: TextBasedChannel | null
  public member: GuildMember | any
  public user: User
  public polyglot: PolyglotExtended

  constructor (options: ICommandContextOptions) {
    this.interaction = options.interaction
    this.guild = options.interaction.guild
    this.channel = options.interaction.channel
    this.member = options.interaction.member
    this.user = options.interaction.user

    this.polyglot = {} as unknown as PolyglotExtended
  }

  setPolyglot (polyglot: PolyglotExtended): void {
    this.polyglot = polyglot
  }
}
