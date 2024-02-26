import {
  type InteractionResponse,
  OAuth2Scopes,
  PermissionFlagsBits,
  hyperlink
} from 'discord.js'

import type Nocronok from '@structures/base/Nocronok'
import { Command, type Context, SlashCommandBuilder } from '@structures/command'

export default abstract class Invite extends Command {
  constructor (client: Nocronok) {
    super(client, { name: 'invite' })
  }

  public static data = new SlashCommandBuilder()
    .setName('invite')
    .setDescription('Create an invite link to add the bot to a server')
    .setDMPermission(false)

  public async execute ({
    interaction
  }: Context): Promise<InteractionResponse<boolean>> {
    const inviteLink = this.client.generateInvite({
      permissions: [
        PermissionFlagsBits.CreateInstantInvite,
        PermissionFlagsBits.KickMembers,
        PermissionFlagsBits.BanMembers,
        PermissionFlagsBits.ManageChannels,
        PermissionFlagsBits.ManageGuild,
        PermissionFlagsBits.AddReactions,
        PermissionFlagsBits.ViewAuditLog,
        PermissionFlagsBits.PrioritySpeaker,
        PermissionFlagsBits.Stream,
        PermissionFlagsBits.ViewChannel,
        PermissionFlagsBits.SendMessages,
        PermissionFlagsBits.SendTTSMessages,
        PermissionFlagsBits.ManageMessages,
        PermissionFlagsBits.EmbedLinks,
        PermissionFlagsBits.AttachFiles,
        PermissionFlagsBits.ReadMessageHistory,
        PermissionFlagsBits.MentionEveryone,
        PermissionFlagsBits.UseExternalEmojis,
        PermissionFlagsBits.ViewGuildInsights,
        PermissionFlagsBits.Connect,
        PermissionFlagsBits.Speak,
        PermissionFlagsBits.MuteMembers,
        PermissionFlagsBits.DeafenMembers,
        PermissionFlagsBits.MoveMembers,
        PermissionFlagsBits.UseVAD,
        PermissionFlagsBits.ChangeNickname,
        PermissionFlagsBits.ManageNicknames,
        PermissionFlagsBits.ManageRoles,
        PermissionFlagsBits.ManageWebhooks,
        PermissionFlagsBits.ManageGuildExpressions,
        PermissionFlagsBits.UseApplicationCommands,
        PermissionFlagsBits.RequestToSpeak,
        PermissionFlagsBits.ManageEvents,
        PermissionFlagsBits.ManageThreads,
        PermissionFlagsBits.CreatePublicThreads,
        PermissionFlagsBits.CreatePrivateThreads,
        PermissionFlagsBits.UseExternalStickers,
        PermissionFlagsBits.SendMessagesInThreads,
        PermissionFlagsBits.UseEmbeddedActivities,
        PermissionFlagsBits.ModerateMembers,
        PermissionFlagsBits.ViewCreatorMonetizationAnalytics,
        PermissionFlagsBits.UseSoundboard,
        PermissionFlagsBits.UseExternalSounds,
        PermissionFlagsBits.SendVoiceMessages
      ],
      scopes: [OAuth2Scopes.Bot]
    })

    return await interaction.reply(hyperlink('Invite Link', inviteLink))
  }
}
