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
import { Permission } from "../permission.js";

export const isModerator: GuardFunction<
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
  if(!(await Permission.isAdmin(interaction.member as GuildMember))) {
    return await interaction.reply({
      content: "https://tenor.com/view/maciek-brzuch-brzuch-boli-brzuch-boli-od-pizzy-boli-brzuch-gif-11153139534340556836"
    })
   } else {
    await next();
  }
};