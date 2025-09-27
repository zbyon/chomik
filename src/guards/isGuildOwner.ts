import {
  ButtonInteraction,
  ChannelSelectMenuInteraction,
  ChatInputCommandInteraction,
  CommandInteraction,
  ContextMenuCommandInteraction,
  GuildMember,
  MentionableSelectMenuInteraction,
  MessageContextMenuCommandInteraction,
  ModalSubmitInteraction,
  RoleSelectMenuInteraction,
  StringSelectMenuInteraction,
  UserContextMenuCommandInteraction,
  UserSelectMenuInteraction
} from "discord.js";
import { Client, GuardFunction } from "discordx";

export const isGuildOwner: GuardFunction<
  | ButtonInteraction
  | ChannelSelectMenuInteraction
  | CommandInteraction
  | ContextMenuCommandInteraction
  | MentionableSelectMenuInteraction
  | ModalSubmitInteraction
  | RoleSelectMenuInteraction
  | StringSelectMenuInteraction
  | UserSelectMenuInteraction
  | UserContextMenuCommandInteraction
  | MessageContextMenuCommandInteraction
  | ChatInputCommandInteraction
> = async (interaction, _: Client, next) => {
  if(interaction.user.id != interaction.guild?.ownerId) {
    return await interaction.reply({
      content: "https://tenor.com/view/maciek-brzuch-brzuch-boli-brzuch-boli-od-pizzy-boli-brzuch-gif-11153139534340556836"
    })
   } else {
    await next();
  }
};